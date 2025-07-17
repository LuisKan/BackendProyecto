const { Mensaje, Conversacion, Persona } = require('../models');

const mensajeController = {
    // Obtener todos los mensajes
    obtenerTodos: async (req, res) => {
        try {
            const mensajes = await Mensaje.findAll({
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'emisor'
                    }
                ],
                order: [['fecha', 'DESC']]
            });
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los mensajes',
                detalle: error.message 
            });
        }
    },

    // Obtener mensaje por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const mensaje = await Mensaje.findByPk(id, {
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'emisor'
                    }
                ]
            });
            
            if (!mensaje) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }
            
            res.json(mensaje);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener el mensaje',
                detalle: error.message 
            });
        }
    },

    // Crear nuevo mensaje
    crear: async (req, res) => {
        try {
            const nuevoMensaje = await Mensaje.create({
                ...req.body,
                fecha: new Date()
            });
            
            // Obtener el mensaje completo con relaciones
            const mensajeCompleto = await Mensaje.findByPk(nuevoMensaje.id, {
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'emisor'
                    }
                ]
            });
            
            res.status(201).json(mensajeCompleto);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear el mensaje',
                detalle: error.message 
            });
        }
    },

    // Actualizar mensaje
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const [filasAfectadas] = await Mensaje.update(req.body, {
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }
            
            const mensajeActualizado = await Mensaje.findByPk(id, {
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'emisor'
                    }
                ]
            });
            
            res.json(mensajeActualizado);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar el mensaje',
                detalle: error.message 
            });
        }
    },

    // Eliminar mensaje
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const filasAfectadas = await Mensaje.destroy({
                where: { id }
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

    // Obtener mensajes por conversación
    obtenerPorConversacion: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            const { limite = 50, offset = 0 } = req.query;
            
            const mensajes = await Mensaje.findAll({
                where: { conversacion_id: conversacionId },
                include: [{
                    model: Persona,
                    as: 'emisor'
                }],
                order: [['fecha', 'ASC']],
                limit: parseInt(limite),
                offset: parseInt(offset)
            });
            
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los mensajes de la conversación',
                detalle: error.message 
            });
        }
    },

    // Obtener mensajes por emisor
    obtenerPorEmisor: async (req, res) => {
        try {
            const { emisorId } = req.params;
            const mensajes = await Mensaje.findAll({
                where: { emisor: emisorId },
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    }
                ],
                order: [['fecha', 'DESC']]
            });
            
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los mensajes del emisor',
                detalle: error.message 
            });
        }
    },

    // Buscar mensajes por texto
    buscarPorTexto: async (req, res) => {
        try {
            const { texto } = req.query;
            const { Op } = require('sequelize');
            
            const mensajes = await Mensaje.findAll({
                where: {
                    texto: {
                        [Op.like]: `%${texto}%`
                    }
                },
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'emisor'
                    }
                ],
                order: [['fecha', 'DESC']]
            });
            
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al buscar mensajes por texto',
                detalle: error.message 
            });
        }
    },

    // Obtener últimos mensajes de una conversación
    obtenerUltimos: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            const { cantidad = 10 } = req.query;
            
            const mensajes = await Mensaje.findAll({
                where: { conversacion_id: conversacionId },
                include: [{
                    model: Persona,
                    as: 'emisor'
                }],
                order: [['fecha', 'DESC']],
                limit: parseInt(cantidad)
            });
            
            // Revertir el orden para mostrar los mensajes más antiguos primero
            res.json(mensajes.reverse());
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los últimos mensajes',
                detalle: error.message 
            });
        }
    },

    // Obtener mensajes por rango de fechas
    obtenerPorFechas: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            const { fechaInicio, fechaFin } = req.query;
            const { Op } = require('sequelize');
            
            const whereCondition = {
                conversacion_id: conversacionId
            };
            
            if (fechaInicio && fechaFin) {
                whereCondition.fecha = {
                    [Op.between]: [fechaInicio, fechaFin]
                };
            } else if (fechaInicio) {
                whereCondition.fecha = {
                    [Op.gte]: fechaInicio
                };
            } else if (fechaFin) {
                whereCondition.fecha = {
                    [Op.lte]: fechaFin
                };
            }
            
            const mensajes = await Mensaje.findAll({
                where: whereCondition,
                include: [{
                    model: Persona,
                    as: 'emisor'
                }],
                order: [['fecha', 'ASC']]
            });
            
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener mensajes por fechas',
                detalle: error.message 
            });
        }
    },

    // Contar mensajes por conversación
    contarPorConversacion: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            
            const count = await Mensaje.count({
                where: { conversacion_id: conversacionId }
            });
            
            res.json({ 
                conversacionId: parseInt(conversacionId),
                totalMensajes: count 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al contar mensajes de la conversación',
                detalle: error.message 
            });
        }
    },

    // Enviar mensaje (crear con validaciones adicionales)
    enviar: async (req, res) => {
        try {
            const { conversacion_id, emisor, texto } = req.body;
            
            // Validar que el emisor sea participante de la conversación
            const { ParticipanteConversacion } = require('../models');
            const participante = await ParticipanteConversacion.findOne({
                where: {
                    conversacion_id,
                    persona_id: emisor
                }
            });
            
            if (!participante) {
                return res.status(403).json({ 
                    error: 'No tienes permisos para enviar mensajes en esta conversación' 
                });
            }
            
            const nuevoMensaje = await Mensaje.create({
                conversacion_id,
                emisor,
                texto,
                fecha: new Date()
            });
            
            // Obtener el mensaje completo
            const mensajeCompleto = await Mensaje.findByPk(nuevoMensaje.id, {
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'emisor'
                    }
                ]
            });
            
            res.status(201).json(mensajeCompleto);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al enviar el mensaje',
                detalle: error.message 
            });
        }
    }
};

module.exports = mensajeController;
