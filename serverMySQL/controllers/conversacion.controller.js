const { Conversacion, ParticipanteConversacion, Persona, Mensaje } = require('../models');

const conversacionController = {
    // Obtener todas las conversaciones
    obtenerTodas: async (req, res) => {
        try {
            const conversaciones = await Conversacion.findAll({
                include: [
                    {
                        model: Persona,
                        as: 'personas',
                        through: { attributes: [] }
                    },
                    {
                        model: Mensaje,
                        as: 'mensajes',
                        limit: 1,
                        order: [['fecha', 'DESC']],
                        include: [{
                            model: Persona,
                            as: 'emisor'
                        }]
                    }
                ]
            });
            res.json(conversaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las conversaciones',
                detalle: error.message 
            });
        }
    },

    // Obtener conversación por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const conversacion = await Conversacion.findByPk(id, {
                include: [
                    {
                        model: Persona,
                        as: 'personas',
                        through: { attributes: [] }
                    },
                    {
                        model: Mensaje,
                        as: 'mensajes',
                        include: [{
                            model: Persona,
                            as: 'emisor'
                        }],
                        order: [['fecha', 'ASC']]
                    }
                ]
            });
            
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            res.json(conversacion);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener la conversación',
                detalle: error.message 
            });
        }
    },

    // Crear nueva conversación
    crear: async (req, res) => {
        try {
            const { participantes } = req.body;
            
            if (!participantes || participantes.length < 2) {
                return res.status(400).json({ 
                    error: 'Se requieren al menos 2 participantes para crear una conversación' 
                });
            }
            
            // Crear la conversación
            const nuevaConversacion = await Conversacion.create();
            
            // Agregar participantes
            const participantesData = participantes.map(personaId => ({
                conversacion_id: nuevaConversacion.id,
                persona_id: personaId
            }));
            
            await ParticipanteConversacion.bulkCreate(participantesData);
            
            // Obtener la conversación completa
            const conversacionCompleta = await Conversacion.findByPk(nuevaConversacion.id, {
                include: [
                    {
                        model: Persona,
                        as: 'personas',
                        through: { attributes: [] }
                    }
                ]
            });
            
            res.status(201).json(conversacionCompleta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear la conversación',
                detalle: error.message 
            });
        }
    },

    // Eliminar conversación
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Eliminar mensajes de la conversación
            await Mensaje.destroy({
                where: { conversacion_id: id }
            });
            
            // Eliminar participantes de la conversación
            await ParticipanteConversacion.destroy({
                where: { conversacion_id: id }
            });
            
            // Eliminar la conversación
            const filasAfectadas = await Conversacion.destroy({
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            res.json({ mensaje: 'Conversación eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar la conversación',
                detalle: error.message 
            });
        }
    },

    // Obtener conversaciones de una persona
    obtenerPorPersona: async (req, res) => {
        try {
            const { personaId } = req.params;
            
            const conversaciones = await Conversacion.findAll({
                include: [
                    {
                        model: Persona,
                        as: 'personas',
                        through: { attributes: [] },
                        where: { id: personaId }
                    },
                    {
                        model: Persona,
                        as: 'personas',
                        through: { attributes: [] }
                    },
                    {
                        model: Mensaje,
                        as: 'mensajes',
                        limit: 1,
                        order: [['fecha', 'DESC']],
                        include: [{
                            model: Persona,
                            as: 'emisor'
                        }]
                    }
                ]
            });
            
            res.json(conversaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las conversaciones de la persona',
                detalle: error.message 
            });
        }
    },

    // Agregar participante a conversación
    agregarParticipante: async (req, res) => {
        try {
            const { id } = req.params;
            const { personaId } = req.body;
            
            // Verificar si la conversación existe
            const conversacion = await Conversacion.findByPk(id);
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Verificar si la persona ya es participante
            const participanteExistente = await ParticipanteConversacion.findOne({
                where: {
                    conversacion_id: id,
                    persona_id: personaId
                }
            });
            
            if (participanteExistente) {
                return res.status(400).json({ error: 'La persona ya es participante de esta conversación' });
            }
            
            // Agregar participante
            await ParticipanteConversacion.create({
                conversacion_id: id,
                persona_id: personaId
            });
            
            // Obtener la conversación actualizada
            const conversacionActualizada = await Conversacion.findByPk(id, {
                include: [
                    {
                        model: Persona,
                        as: 'personas',
                        through: { attributes: [] }
                    }
                ]
            });
            
            res.json(conversacionActualizada);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al agregar participante a la conversación',
                detalle: error.message 
            });
        }
    },

    // Remover participante de conversación
    removerParticipante: async (req, res) => {
        try {
            const { id } = req.params;
            const { personaId } = req.body;
            
            const filasAfectadas = await ParticipanteConversacion.destroy({
                where: {
                    conversacion_id: id,
                    persona_id: personaId
                }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Participante no encontrado en esta conversación' });
            }
            
            // Obtener la conversación actualizada
            const conversacionActualizada = await Conversacion.findByPk(id, {
                include: [
                    {
                        model: Persona,
                        as: 'personas',
                        through: { attributes: [] }
                    }
                ]
            });
            
            res.json(conversacionActualizada);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al remover participante de la conversación',
                detalle: error.message 
            });
        }
    },

    // Buscar conversación entre dos personas específicas
    buscarEntrePersonas: async (req, res) => {
        try {
            const { persona1Id, persona2Id } = req.query;
            
            // Buscar conversaciones donde ambas personas sean participantes
            const conversaciones = await Conversacion.findAll({
                include: [
                    {
                        model: ParticipanteConversacion,
                        as: 'participantes',
                        where: {
                            persona_id: persona1Id
                        }
                    }
                ]
            });
            
            // Filtrar conversaciones que también incluyan a la segunda persona
            const conversacionesComunes = [];
            for (const conv of conversaciones) {
                const participante2 = await ParticipanteConversacion.findOne({
                    where: {
                        conversacion_id: conv.id,
                        persona_id: persona2Id
                    }
                });
                
                if (participante2) {
                    const conversacionCompleta = await Conversacion.findByPk(conv.id, {
                        include: [
                            {
                                model: Persona,
                                as: 'personas',
                                through: { attributes: [] }
                            },
                            {
                                model: Mensaje,
                                as: 'mensajes',
                                limit: 1,
                                order: [['fecha', 'DESC']],
                                include: [{
                                    model: Persona,
                                    as: 'emisor'
                                }]
                            }
                        ]
                    });
                    conversacionesComunes.push(conversacionCompleta);
                }
            }
            
            res.json(conversacionesComunes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al buscar conversaciones entre personas',
                detalle: error.message 
            });
        }
    }
};

module.exports = conversacionController;
