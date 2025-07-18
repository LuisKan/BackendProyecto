const { Conversacion, ParticipanteConversacion, Persona, Mensaje } = require('../models');

const conversacionController = {
    // Obtener todas las conversaciones
    obtenerTodas: async (req, res) => {
        try {
            const conversaciones = await Conversacion.findAll({
                include: [
                    {
                        model: ParticipanteConversacion,
                        as: 'participantes',
                        include: [{
                            model: Persona,
                            as: 'persona',
                            attributes: ['id']
                        }]
                    },
                    {
                        model: Mensaje,
                        as: 'mensajes',
                        include: [{
                            model: Persona,
                            as: 'personaEmisor',
                            attributes: ['id']
                        }],
                        order: [['fecha', 'ASC']]
                    }
                ]
            });

            // Formatear la respuesta según el formato esperado por el frontend
            const conversacionesFormateadas = conversaciones.map(conv => {
                const data = conv.toJSON();
                
                // Convertir participantes a array simple de IDs
                data.participantes = data.participantes ? 
                    data.participantes.map(p => p.persona.id.toString()) : [];
                
                // Formatear mensajes
                data.mensajes = data.mensajes ? data.mensajes.map(msg => ({
                    id: msg.id,
                    emisor: msg.personaEmisor ? msg.personaEmisor.id.toString() : msg.emisor.toString(),
                    fecha: msg.fecha,
                    texto: msg.texto
                })) : [];
                
                // Convertir ID a string con prefijo
                data.id = `conv${data.id}`;
                
                return data;
            });

            res.json(conversacionesFormateadas);
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
            
            // Extraer el ID numérico si viene con prefijo
            const idNumerico = id.toString().startsWith('conv') ? 
                parseInt(id.toString().replace('conv', '').replace('-', '')) : parseInt(id);
            
            const conversacion = await Conversacion.findByPk(idNumerico, {
                include: [
                    {
                        model: ParticipanteConversacion,
                        as: 'participantes',
                        include: [{
                            model: Persona,
                            as: 'persona',
                            attributes: ['id']
                        }]
                    },
                    {
                        model: Mensaje,
                        as: 'mensajes',
                        include: [{
                            model: Persona,
                            as: 'personaEmisor',
                            attributes: ['id']
                        }],
                        order: [['fecha', 'ASC']]
                    }
                ]
            });
            
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Formatear la respuesta
            const data = conversacion.toJSON();
            data.participantes = data.participantes ? 
                data.participantes.map(p => p.persona.id.toString()) : [];
            
            data.mensajes = data.mensajes ? data.mensajes.map(msg => ({
                id: msg.id,
                emisor: msg.personaEmisor ? msg.personaEmisor.id.toString() : msg.emisor.toString(),
                fecha: msg.fecha,
                texto: msg.texto
            })) : [];
            
            data.id = `conv${data.id}`;
            
            res.json(data);
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
            
            // Validaciones según tu frontend
            if (!participantes || participantes.length !== 2) {
                return res.status(400).json({ 
                    error: 'Se requieren exactamente dos participantes para crear una conversación' 
                });
            }
            
            if (participantes[0] === participantes[1]) {
                return res.status(400).json({ 
                    error: 'Los participantes deben ser diferentes' 
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
            
            // Respuesta formateada según tu frontend
            const respuesta = {
                id: `conv${nuevaConversacion.id}`, // Usar el ID real de la base de datos
                participantes: participantes,
                mensajes: []
            };
            
            res.status(201).json(respuesta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear la conversación',
                detalle: error.message 
            });
        }
    },

    // Enviar mensaje a conversación (POST /api/v1/conversaciones/:id/mensajes)
    enviarMensaje: async (req, res) => {
        try {
            const { id } = req.params;
            const { emisor, texto } = req.body;
            
            // Extraer el ID numérico si viene con prefijo
            const idNumerico = id.toString().startsWith('conv') ? 
                parseInt(id.toString().replace('conv', '').replace('-', '')) : parseInt(id);
            
            // Verificar si la conversación existe
            const conversacion = await Conversacion.findByPk(idNumerico);
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Crear el mensaje
            const nuevoMensaje = await Mensaje.create({
                conversacion_id: idNumerico,
                emisor: emisor,
                texto: texto,
                fecha: new Date()
            });
            
            // Respuesta formateada según tu frontend
            const respuesta = {
                mensaje: 'Mensaje agregado correctamente',
                mensajeEnviado: {
                    id: `msg-${Date.now()}`,
                    emisor: emisor,
                    texto: texto,
                    fecha: nuevoMensaje.fecha.toISOString()
                }
            };
            
            res.status(201).json(respuesta);
        } catch (error) {
            res.status(500).json({ 
                error: 'No se pudo procesar el mensaje',
                detalle: error.message 
            });
        }
    },

    // Editar mensaje (PUT /api/v1/conversaciones/:idConversacion/mensajes/:idMensaje)
    editarMensaje: async (req, res) => {
        try {
            const { idConversacion, idMensaje } = req.params;
            const { texto } = req.body;
            
            if (!texto) {
                return res.status(400).json({ error: "Falta el campo 'texto'" });
            }
            
            // Extraer IDs numéricos
            const idConvNumerico = idConversacion.toString().startsWith('conv') ? 
                parseInt(idConversacion.toString().replace('conv', '').replace('-', '')) : parseInt(idConversacion);
            const idMsgNumerico = idMensaje.toString().replace('msg-', '');
            
            // Buscar el mensaje
            const mensaje = await Mensaje.findOne({
                where: {
                    id: idMsgNumerico,
                    conversacion_id: idConvNumerico
                },
                include: [{
                    model: Persona,
                    as: 'personaEmisor',
                    attributes: ['id']
                }]
            });
            
            if (!mensaje) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }
            
            // Actualizar el mensaje
            await mensaje.update({ texto });
            
            // Respuesta formateada
            const respuesta = {
                mensaje: {
                    id: parseInt(idMsgNumerico),
                    emisor: mensaje.personaEmisor ? mensaje.personaEmisor.id.toString() : mensaje.emisor.toString(),
                    fecha: mensaje.fecha,
                    texto: texto
                }
            };
            
            res.json(respuesta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al editar el mensaje',
                detalle: error.message 
            });
        }
    },

    // Eliminar mensaje (DELETE /api/v1/conversaciones/:id/mensajes/:mensajeId)
    eliminarMensaje: async (req, res) => {
        try {
            const { id, mensajeId } = req.params;
            
            // Extraer IDs numéricos
            const idConvNumerico = id.toString().startsWith('conv') ? 
                parseInt(id.toString().replace('conv', '').replace('-', '')) : parseInt(id);
            const idMsgNumerico = mensajeId.toString().replace('msg-', '');
            
            // Verificar si la conversación existe
            const conversacion = await Conversacion.findByPk(idConvNumerico);
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Eliminar el mensaje
            const filasAfectadas = await Mensaje.destroy({
                where: {
                    id: idMsgNumerico,
                    conversacion_id: idConvNumerico
                }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }
            
            res.json({ mensaje: 'Mensaje eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar el mensaje',
                detalle: error.message 
            });
        }
    },

    // Eliminar conversación
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Extraer el ID numérico si viene con prefijo
            const idNumerico = id.toString().startsWith('conv') ? 
                parseInt(id.toString().replace('conv', '').replace('-', '')) : parseInt(id);
            
            // Verificar si la conversación existe
            const conversacion = await Conversacion.findByPk(idNumerico);
            if (!conversacion) {
                return res.status(404).json({ error: 'Conversación no encontrada' });
            }
            
            // Eliminar mensajes de la conversación
            await Mensaje.destroy({
                where: { conversacion_id: idNumerico }
            });
            
            // Eliminar participantes de la conversación
            await ParticipanteConversacion.destroy({
                where: { conversacion_id: idNumerico }
            });
            
            // Eliminar la conversación
            await Conversacion.destroy({
                where: { id: idNumerico }
            });
            
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
