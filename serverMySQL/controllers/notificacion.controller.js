const { Notificacion, Persona } = require('../models');

const notificacionController = {
    // Obtener todas las notificaciones
    obtenerTodas: async (req, res) => {
        try {
            const notificaciones = await Notificacion.findAll({
                include: [{
                    model: Persona,
                    as: 'usuario'
                }],
                order: [['fecha', 'DESC']]
            });
            res.json(notificaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las notificaciones',
                detalle: error.message 
            });
        }
    },

    // Obtener notificación por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const notificacion = await Notificacion.findByPk(id, {
                include: [{
                    model: Persona,
                    as: 'usuario'
                }]
            });
            
            if (!notificacion) {
                return res.status(404).json({ error: 'Notificación no encontrada' });
            }
            
            res.json(notificacion);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener la notificación',
                detalle: error.message 
            });
        }
    },

    // Crear nueva notificación
    crear: async (req, res) => {
        try {
            const nuevaNotificacion = await Notificacion.create({
                ...req.body,
                fecha: req.body.fecha || new Date()
            });
            
            // Obtener la notificación completa con relaciones
            const notificacionCompleta = await Notificacion.findByPk(nuevaNotificacion.id, {
                include: [{
                    model: Persona,
                    as: 'usuario'
                }]
            });
            
            res.status(201).json(notificacionCompleta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear la notificación',
                detalle: error.message 
            });
        }
    },

    // Actualizar notificación
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const [filasAfectadas] = await Notificacion.update(req.body, {
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Notificación no encontrada' });
            }
            
            const notificacionActualizada = await Notificacion.findByPk(id, {
                include: [{
                    model: Persona,
                    as: 'usuario'
                }]
            });
            
            res.json(notificacionActualizada);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar la notificación',
                detalle: error.message 
            });
        }
    },

    // Eliminar notificación
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const filasAfectadas = await Notificacion.destroy({
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Notificación no encontrada' });
            }
            
            res.json({ mensaje: 'Notificación eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar la notificación',
                detalle: error.message 
            });
        }
    },

    // Obtener notificaciones por usuario
    obtenerPorUsuario: async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const notificaciones = await Notificacion.findAll({
                where: { usuarioId },
                order: [['fecha', 'DESC']]
            });
            
            res.json(notificaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las notificaciones del usuario',
                detalle: error.message 
            });
        }
    },

    // Obtener notificaciones por tipo
    obtenerPorTipo: async (req, res) => {
        try {
            const { tipo } = req.params;
            const notificaciones = await Notificacion.findAll({
                where: { tipo },
                include: [{
                    model: Persona,
                    as: 'usuario'
                }],
                order: [['fecha', 'DESC']]
            });
            
            res.json(notificaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las notificaciones por tipo',
                detalle: error.message 
            });
        }
    },

    // Marcar notificaciones como leídas (cambiar tipo)
    marcarComoLeida: async (req, res) => {
        try {
            const { id } = req.params;
            const [filasAfectadas] = await Notificacion.update(
                { tipo: 'leida' },
                { where: { id } }
            );
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Notificación no encontrada' });
            }
            
            const notificacionActualizada = await Notificacion.findByPk(id, {
                include: [{
                    model: Persona,
                    as: 'usuario'
                }]
            });
            
            res.json(notificacionActualizada);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al marcar la notificación como leída',
                detalle: error.message 
            });
        }
    },

    // Marcar todas las notificaciones de un usuario como leídas
    marcarTodasComoLeidasPorUsuario: async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const [filasAfectadas] = await Notificacion.update(
                { tipo: 'leida' },
                { 
                    where: { 
                        usuarioId,
                        tipo: { [require('sequelize').Op.ne]: 'leida' }
                    } 
                }
            );
            
            res.json({ 
                mensaje: `${filasAfectadas} notificaciones marcadas como leídas` 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al marcar las notificaciones como leídas',
                detalle: error.message 
            });
        }
    },

    // Crear notificación para reserva
    crearParaReserva: async (req, res) => {
        try {
            const { usuarioId, reservaId, estadoReserva } = req.body;
            
            let texto = '';
            let tipo = '';
            
            switch (estadoReserva) {
                case 'aceptada':
                    texto = `Tu reserva #${reservaId} ha sido aceptada`;
                    tipo = 'aceptada';
                    break;
                case 'rechazada':
                    texto = `Tu reserva #${reservaId} ha sido rechazada`;
                    tipo = 'rechazada';
                    break;
                case 'confirmada':
                    texto = `Tu reserva #${reservaId} ha sido confirmada`;
                    tipo = 'confirmada';
                    break;
                default:
                    texto = `Nueva actualización en tu reserva #${reservaId}`;
                    tipo = 'nueva';
            }
            
            const nuevaNotificacion = await Notificacion.create({
                usuarioId,
                texto,
                tipo,
                fecha: new Date()
            });
            
            const notificacionCompleta = await Notificacion.findByPk(nuevaNotificacion.id, {
                include: [{
                    model: Persona,
                    as: 'usuario'
                }]
            });
            
            res.status(201).json(notificacionCompleta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear la notificación de reserva',
                detalle: error.message 
            });
        }
    }
};

module.exports = notificacionController;
