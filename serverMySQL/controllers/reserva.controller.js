const { Reserva, Habitacion, Persona } = require('../models');
const { Op } = require('sequelize');

const reservaController = {
    // Obtener todas las reservas - Formato Postman
    obtenerTodas: async (req, res) => {
        try {
            const reservas = await Reserva.findAll({
                include: [
                    {
                        model: Habitacion,
                        as: 'habitacion'
                    }
                ],
                order: [['fechaCreacion', 'DESC']]
            });

            if (reservas.length === 0) {
                return res.status(404).json({ 
                    error: 'Reserva no encontrada' 
                });
            }

            // Formatear respuesta según especificación Postman
            const reservasFormateadas = reservas.map(reserva => ({
                id: reserva.id.toString(),
                habitacionId: reserva.habitacionId.toString(),
                tituloHabitacion: reserva.habitacion ? reserva.habitacion.nombre : `Habitación ${reserva.habitacionId}`,
                imagen: reserva.habitacion ? (reserva.habitacion.portada || "/Habitaciones/default.webp") : "/Habitaciones/default.webp",
                usuarioId: reserva.usuarioId.toString(),
                usuarioNombre: reserva.usuarioNombre,
                correo: reserva.correo,
                checkIn: reserva.checkIn,
                checkOut: reserva.checkOut,
                adultos: reserva.adultos,
                ninos: reserva.ninos,
                personas: reserva.personas || `${reserva.adultos} Adulto(s), ${reserva.ninos} Niño(s)`,
                precio: reserva.precio,
                estado: reserva.estado,
                fechaCreacion: reserva.fechaCreacion ? reserva.fechaCreacion.toISOString() : new Date().toISOString()
            }));

            res.json({ reservas: reservasFormateadas });
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor'
            });
        }
    },

    // Crear nueva reserva - Formato Postman
    crear: async (req, res) => {
        try {
            const { habitacionId, usuarioId, usuarioNombre, correo, checkIn, checkOut, adultos, ninos, precio } = req.body;
            
            // Validar campos obligatorios
            if (!habitacionId) {
                return res.status(400).json({ 
                    error: "El campo 'habitacionId' es obligatorio"
                });
            }

            // Verificar que la habitación existe
            const habitacion = await Habitacion.findByPk(habitacionId);
            if (!habitacion) {
                return res.status(400).json({ 
                    error: "El campo 'habitacionId' es obligatorio"
                });
            }

            // Crear la reserva
            const nuevaReserva = await Reserva.create({
                habitacionId,
                usuarioId,
                usuarioNombre,
                correo,
                checkIn,
                checkOut,
                adultos: adultos || 1,
                ninos: ninos || 0,
                personas: `${adultos || 1} Adulto(s), ${ninos || 0} Niño(s)`,
                precio,
                estado: 'pendiente',
                fechaCreacion: new Date()
            });

            // Formatear respuesta según especificación Postman
            const respuesta = {
                mensaje: "Reserva creada exitosamente",
                id: nuevaReserva.id.toString()
            };

            res.status(201).json(respuesta);
        } catch (error) {
            console.error('Error al crear reserva:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor'
            });
        }
    },

    // Actualizar reserva - Formato Postman
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { checkIn, checkOut, estado } = req.body;
            
            // Buscar la reserva
            const reserva = await Reserva.findByPk(id);
            if (!reserva) {
                return res.status(403).json({ 
                    error: 'Acceso denegado' 
                });
            }

            // Actualizar la reserva
            await Reserva.update(
                { checkIn, checkOut, estado },
                { where: { id } }
            );

            // Formatear respuesta según especificación Postman
            const respuesta = {
                mensaje: "Reserva actualizada correctamente"
            };

            res.json(respuesta);
        } catch (error) {
            console.error('Error al actualizar reserva:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor'
            });
        }
    },

    // Eliminar reserva - Formato Postman
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Buscar la reserva antes de eliminarla
            const reserva = await Reserva.findByPk(id);
            if (!reserva) {
                return res.status(404).json({ 
                    error: 'Reserva no encontrada' 
                });
            }

            // Eliminar la reserva
            await Reserva.destroy({
                where: { id }
            });

            // Formatear respuesta según especificación Postman
            const respuesta = {
                mensaje: "Reserva eliminada"
            };

            res.json(respuesta);
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor'
            });
        }
    },

};

module.exports = reservaController;
