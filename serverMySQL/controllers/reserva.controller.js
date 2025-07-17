const { Reserva, Habitacion, Persona } = require('../models');
const { Op } = require('sequelize');

const reservaController = {
    // Obtener todas las reservas con información de habitación y usuario
    obtenerTodas: async (req, res) => {
        try {
            const reservas = await Reserva.findAll({
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    },
                    {
                        model: Persona,
                        as: 'usuario'
                    }
                ]
            });
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las reservas',
                detalle: error.message 
            });
        }
    },

    // Obtener reserva por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const reserva = await Reserva.findByPk(id, {
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    },
                    {
                        model: Persona,
                        as: 'usuario'
                    }
                ]
            });
            
            if (!reserva) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }
            
            res.json(reserva);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener la reserva',
                detalle: error.message 
            });
        }
    },

    // Crear nueva reserva
    crear: async (req, res) => {
        try {
            const nuevaReserva = await Reserva.create({
                ...req.body,
                fechaCreacion: new Date()
            });
            
            // Obtener la reserva completa con relaciones
            const reservaCompleta = await Reserva.findByPk(nuevaReserva.id, {
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    },
                    {
                        model: Persona,
                        as: 'usuario'
                    }
                ]
            });
            
            res.status(201).json(reservaCompleta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear la reserva',
                detalle: error.message 
            });
        }
    },

    // Actualizar reserva
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const [filasAfectadas] = await Reserva.update(req.body, {
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }
            
            const reservaActualizada = await Reserva.findByPk(id, {
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    },
                    {
                        model: Persona,
                        as: 'usuario'
                    }
                ]
            });
            
            res.json(reservaActualizada);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar la reserva',
                detalle: error.message 
            });
        }
    },

    // Eliminar reserva
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const filasAfectadas = await Reserva.destroy({
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }
            
            res.json({ mensaje: 'Reserva eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar la reserva',
                detalle: error.message 
            });
        }
    },

    // Obtener reservas por usuario
    obtenerPorUsuario: async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const reservas = await Reserva.findAll({
                where: { usuarioId },
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    }
                ]
            });
            
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las reservas del usuario',
                detalle: error.message 
            });
        }
    },

    // Obtener reservas por habitación
    obtenerPorHabitacion: async (req, res) => {
        try {
            const { habitacionId } = req.params;
            const reservas = await Reserva.findAll({
                where: { habitacionId },
                include: [
                    {
                        model: Persona,
                        as: 'usuario'
                    }
                ]
            });
            
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las reservas de la habitación',
                detalle: error.message 
            });
        }
    },

    // Obtener reservas por estado
    obtenerPorEstado: async (req, res) => {
        try {
            const { estado } = req.params;
            const reservas = await Reserva.findAll({
                where: { estado },
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    },
                    {
                        model: Persona,
                        as: 'usuario'
                    }
                ]
            });
            
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las reservas por estado',
                detalle: error.message 
            });
        }
    },

    // Cambiar estado de reserva
    cambiarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            const [filasAfectadas] = await Reserva.update(
                { estado },
                { where: { id } }
            );
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }
            
            const reservaActualizada = await Reserva.findByPk(id, {
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    },
                    {
                        model: Persona,
                        as: 'usuario'
                    }
                ]
            });
            
            res.json(reservaActualizada);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al cambiar el estado de la reserva',
                detalle: error.message 
            });
        }
    },

    // Verificar disponibilidad de habitación en fechas específicas
    verificarDisponibilidad: async (req, res) => {
        try {
            const { habitacionId, checkIn, checkOut } = req.query;
            
            const reservasConflicto = await Reserva.findAll({
                where: {
                    habitacionId,
                    estado: {
                        [Op.in]: ['aceptada', 'confirmada']
                    },
                    [Op.or]: [
                        {
                            checkIn: {
                                [Op.between]: [checkIn, checkOut]
                            }
                        },
                        {
                            checkOut: {
                                [Op.between]: [checkIn, checkOut]
                            }
                        },
                        {
                            [Op.and]: [
                                {
                                    checkIn: {
                                        [Op.lte]: checkIn
                                    }
                                },
                                {
                                    checkOut: {
                                        [Op.gte]: checkOut
                                    }
                                }
                            ]
                        }
                    ]
                }
            });
            
            const disponible = reservasConflicto.length === 0;
            
            res.json({
                disponible,
                reservasConflicto: reservasConflicto.length,
                mensaje: disponible ? 'Habitación disponible' : 'Habitación no disponible en esas fechas'
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al verificar disponibilidad',
                detalle: error.message 
            });
        }
    }
};

module.exports = reservaController;
