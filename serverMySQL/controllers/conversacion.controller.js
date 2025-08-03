const { Conversacion, ParticipanteConversacion, Persona, Mensaje } = require('../models');
const { Op } = require('sequelize');

const conversacionController = {
    // ========== FLUJO PRINCIPAL DE CHAT ==========
    
    // Buscar o crear conversación entre dos personas (ENDPOINT PRINCIPAL)
    buscarOCrearConversacion: async (req, res) => {
        try {
            const { persona1, persona2 } = req.body;
            
            // Validaciones
            if (!persona1 || !persona2) {
                return res.status(400).json({ 
                    error: 'Se requieren persona1 y persona2' 
                });
            }
            
            if (persona1 === persona2) {
                return res.status(400).json({ 
                    error: 'No puedes crear una conversación contigo mismo' 
                });
            }
            
            // Verificar que ambas personas existen
            const personas = await Persona.findAll({
                where: { id: [persona1, persona2] },
                attributes: ['id', 'primerNombre', 'correo']
            });
            
            if (personas.length !== 2) {
                return res.status(404).json({ 
                    error: 'Una o ambas personas no existen' 
                });
            }
            
            // Buscar conversación existente entre estas dos personas
            let conversacion = await conversacionController._buscarConversacionEntrePersonas(persona1, persona2);
            
            // Si no existe, crear nueva conversación
            if (!conversacion) {
                conversacion = await conversacionController._crearNuevaConversacion([persona1, persona2]);
            }
            
            // Obtener conversación completa con mensajes
            const conversacionCompleta = await conversacionController._obtenerConversacionCompleta(conversacion.id);
            
            res.json({
                conversacion: conversacionCompleta,
                mensaje: conversacion.esNueva ? 'Nueva conversación creada' : 'Conversación encontrada'
            });
            
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al buscar o crear conversación',
                detalle: error.message 
            });
        }
    },

    // Enviar mensaje a una conversación
    enviarMensaje: async (req, res) => {
        try {
            const { id } = req.params;
            const { emisor, texto } = req.body;
            
            // Validaciones
            if (!emisor || !texto) {
                return res.status(400).json({ 
                    error: 'Se requieren emisor y texto' 
                });
            }
            
            // Verificar que la conversación existe
            const conversacion = await Conversacion.findByPk(id);
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Verificar que el emisor es participante de la conversación
            const esParticipante = await ParticipanteConversacion.findOne({
                where: {
                    conversacion_id: id,
                    persona_id: emisor
                }
            });
            
            if (!esParticipante) {
                return res.status(403).json({ 
                    error: 'No tienes permisos para enviar mensajes en esta conversación' 
                });
            }
            
            // Crear el mensaje
            const nuevoMensaje = await Mensaje.create({
                conversacion_id: id,
                emisor: emisor,
                texto: texto.trim(),
                fecha: new Date()
            });
            
            // Obtener el mensaje completo con información del emisor
            const mensajeCompleto = await Mensaje.findByPk(nuevoMensaje.id, {
                include: [{
                    model: Persona,
                    as: 'personaEmisor',
                    attributes: ['id', 'primerNombre']
                }]
            });
            
            res.status(201).json({
                mensaje: {
                    id: mensajeCompleto.id,
                    emisor: mensajeCompleto.emisor,
                    emisorNombre: mensajeCompleto.personaEmisor.primerNombre,
                    texto: mensajeCompleto.texto,
                    fecha: mensajeCompleto.fecha
                }
            });
            
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al enviar mensaje',
                detalle: error.message 
            });
        }
    },

    // Obtener conversaciones de un usuario
    obtenerConversacionesUsuario: async (req, res) => {
        try {
            const { userId } = req.params;
            
            // Verificar que el usuario existe
            const usuario = await Persona.findByPk(userId);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            // Obtener IDs de conversaciones donde participa el usuario
            const participacionesUsuario = await ParticipanteConversacion.findAll({
                where: { persona_id: userId },
                attributes: ['conversacion_id']
            });
            
            const conversacionIds = participacionesUsuario.map(p => p.conversacion_id);
            
            if (conversacionIds.length === 0) {
                return res.json([]);
            }
            
            // Obtener conversaciones completas
            const conversaciones = await Conversacion.findAll({
                where: { id: conversacionIds },
                include: [
                    {
                        model: ParticipanteConversacion,
                        as: 'participantes',
                        include: [{
                            model: Persona,
                            as: 'persona',
                            attributes: ['id', 'primerNombre', 'correo']
                        }]
                    },
                    {
                        model: Mensaje,
                        as: 'mensajes',
                        limit: 1,
                        order: [['fecha', 'DESC']],
                        include: [{
                            model: Persona,
                            as: 'personaEmisor',
                            attributes: ['id', 'primerNombre']
                        }]
                    }
                ]
            });
            
            // Formatear respuesta
            const conversacionesFormateadas = conversaciones.map(conv => {
                const data = conv.toJSON();
                
                // Obtener el otro participante (no el usuario actual)
                const otroParticipante = data.participantes.find(p => p.persona.id != userId);
                
                return {
                    id: data.id,
                    otroUsuario: otroParticipante ? {
                        id: otroParticipante.persona.id,
                        nombre: otroParticipante.persona.primerNombre,
                        correo: otroParticipante.persona.correo
                    } : null,
                    ultimoMensaje: data.mensajes.length > 0 ? {
                        texto: data.mensajes[0].texto,
                        fecha: data.mensajes[0].fecha,
                        emisor: data.mensajes[0].emisor,
                        emisorNombre: data.mensajes[0].personaEmisor.primerNombre
                    } : null
                };
            });
            
            res.json(conversacionesFormateadas);
            
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener conversaciones del usuario',
                detalle: error.message 
            });
        }
    },

    // Obtener mensajes de una conversación
    obtenerMensajesConversacion: async (req, res) => {
        try {
            const { id } = req.params;
            const { limite = 50, offset = 0 } = req.query;
            
            // Verificar que la conversación existe
            const conversacion = await Conversacion.findByPk(id);
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Obtener mensajes
            const mensajes = await Mensaje.findAll({
                where: { conversacion_id: id },
                include: [{
                    model: Persona,
                    as: 'personaEmisor',
                    attributes: ['id', 'primerNombre']
                }],
                order: [['fecha', 'ASC']],
                limit: parseInt(limite),
                offset: parseInt(offset)
            });
            
            // Formatear mensajes
            const mensajesFormateados = mensajes.map(msg => ({
                id: msg.id,
                emisor: msg.emisor,
                emisorNombre: msg.personaEmisor.primerNombre,
                texto: msg.texto,
                fecha: msg.fecha
            }));
            
            res.json({
                conversacionId: parseInt(id),
                mensajes: mensajesFormateados,
                total: mensajes.length
            });
            
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener mensajes de la conversación',
                detalle: error.message 
            });
        }
    },

    // ========== MÉTODOS AUXILIARES PRIVADOS ==========
    
    // Buscar conversación existente entre dos personas
    _buscarConversacionEntrePersonas: async (persona1, persona2) => {
        // Buscar conversaciones donde participen ambas personas
        const conversacionesPersona1 = await ParticipanteConversacion.findAll({
            where: { persona_id: persona1 },
            attributes: ['conversacion_id']
        });
        
        const conversacionesPersona2 = await ParticipanteConversacion.findAll({
            where: { persona_id: persona2 },
            attributes: ['conversacion_id']
        });
        
        // Encontrar conversaciones en común
        const idsPersona1 = conversacionesPersona1.map(p => p.conversacion_id);
        const idsPersona2 = conversacionesPersona2.map(p => p.conversacion_id);
        
        const conversacionesComunes = idsPersona1.filter(id => idsPersona2.includes(id));
        
        if (conversacionesComunes.length === 0) {
            return null;
        }
        
        // Verificar que la primera conversación común tenga exactamente 2 participantes
        for (const conversacionId of conversacionesComunes) {
            const totalParticipantes = await ParticipanteConversacion.count({
                where: { conversacion_id: conversacionId }
            });
            
            if (totalParticipantes === 2) {
                const conversacion = await Conversacion.findByPk(conversacionId);
                return conversacion;
            }
        }
        
        return null;
    },

    // Crear nueva conversación
    _crearNuevaConversacion: async (participantes) => {
        // Crear conversación
        const nuevaConversacion = await Conversacion.create();
        
        // Agregar participantes
        const participantesData = participantes.map(personaId => ({
            conversacion_id: nuevaConversacion.id,
            persona_id: personaId
        }));
        
        await ParticipanteConversacion.bulkCreate(participantesData);
        
        // Marcar como nueva para la respuesta
        nuevaConversacion.esNueva = true;
        
        return nuevaConversacion;
    },

    // Obtener conversación completa con participantes y mensajes
    _obtenerConversacionCompleta: async (conversacionId) => {
        const conversacion = await Conversacion.findByPk(conversacionId, {
            include: [
                {
                    model: ParticipanteConversacion,
                    as: 'participantes',
                    include: [{
                        model: Persona,
                        as: 'persona',
                        attributes: ['id', 'primerNombre', 'correo']
                    }]
                },
                {
                    model: Mensaje,
                    as: 'mensajes',
                    include: [{
                        model: Persona,
                        as: 'personaEmisor',
                        attributes: ['id', 'primerNombre']
                    }],
                    order: [['fecha', 'ASC']],
                    limit: 50 // Últimos 50 mensajes
                }
            ]
        });
        
        const data = conversacion.toJSON();
        
        return {
            id: data.id,
            participantes: data.participantes.map(p => ({
                id: p.persona.id,
                nombre: p.persona.primerNombre,
                correo: p.persona.correo
            })),
            mensajes: data.mensajes.map(msg => ({
                id: msg.id,
                emisor: msg.emisor,
                emisorNombre: msg.personaEmisor.primerNombre,
                texto: msg.texto,
                fecha: msg.fecha
            }))
        };
    },

    // ========== MÉTODOS ADICIONALES ==========
    
    // Eliminar conversación completa
    eliminarConversacion: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar que la conversación existe
            const conversacion = await Conversacion.findByPk(id);
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Eliminar en orden: mensajes -> participantes -> conversación
            await Mensaje.destroy({ where: { conversacion_id: id } });
            await ParticipanteConversacion.destroy({ where: { conversacion_id: id } });
            await Conversacion.destroy({ where: { id: id } });
            
            res.json({ mensaje: 'Conversación eliminada correctamente' });
            
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar conversación',
                detalle: error.message 
            });
        }
    }
};

module.exports = conversacionController;
