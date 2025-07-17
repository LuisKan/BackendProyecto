const { Habitacion, HabitacionAmenity } = require('../models');

const habitacionController = {
    // Obtener todas las habitaciones con sus amenities
    obtenerTodas: async (req, res) => {
        try {
            const habitaciones = await Habitacion.findAll({
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities'
                }]
            });
            res.json(habitaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las habitaciones',
                detalle: error.message 
            });
        }
    },

    // Obtener habitación por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const habitacion = await Habitacion.findByPk(id, {
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities'
                }]
            });
            
            if (!habitacion) {
                return res.status(404).json({ error: 'Habitación no encontrada' });
            }
            
            res.json(habitacion);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener la habitación',
                detalle: error.message 
            });
        }
    },

    // Crear nueva habitación
    crear: async (req, res) => {
        try {
            const { amenities, ...habitacionData } = req.body;
            
            // Crear la habitación
            const nuevaHabitacion = await Habitacion.create(habitacionData);
            
            // Agregar amenities si se proporcionan
            if (amenities && amenities.length > 0) {
                const amenitiesData = amenities.map(amenity => ({
                    habitacion_id: nuevaHabitacion.id,
                    amenity
                }));
                await HabitacionAmenity.bulkCreate(amenitiesData);
            }
            
            // Obtener la habitación completa con amenities
            const habitacionCompleta = await Habitacion.findByPk(nuevaHabitacion.id, {
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities'
                }]
            });
            
            res.status(201).json(habitacionCompleta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear la habitación',
                detalle: error.message 
            });
        }
    },

    // Actualizar habitación
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { amenities, ...habitacionData } = req.body;
            
            // Actualizar datos de la habitación
            const [filasAfectadas] = await Habitacion.update(habitacionData, {
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Habitación no encontrada' });
            }
            
            // Si se proporcionan amenities, actualizarlos
            if (amenities) {
                // Eliminar amenities existentes
                await HabitacionAmenity.destroy({
                    where: { habitacion_id: id }
                });
                
                // Crear nuevos amenities
                if (amenities.length > 0) {
                    const amenitiesData = amenities.map(amenity => ({
                        habitacion_id: id,
                        amenity
                    }));
                    await HabitacionAmenity.bulkCreate(amenitiesData);
                }
            }
            
            // Obtener la habitación actualizada
            const habitacionActualizada = await Habitacion.findByPk(id, {
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities'
                }]
            });
            
            res.json(habitacionActualizada);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar la habitación',
                detalle: error.message 
            });
        }
    },

    // Eliminar habitación
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Eliminar amenities primero
            await HabitacionAmenity.destroy({
                where: { habitacion_id: id }
            });
            
            // Eliminar habitación
            const filasAfectadas = await Habitacion.destroy({
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Habitación no encontrada' });
            }
            
            res.json({ mensaje: 'Habitación eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar la habitación',
                detalle: error.message 
            });
        }
    },

    // Buscar habitaciones por tipo
    buscarPorTipo: async (req, res) => {
        try {
            const { tipo } = req.params;
            const habitaciones = await Habitacion.findAll({
                where: { tipo },
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities'
                }]
            });
            
            res.json(habitaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al buscar habitaciones por tipo',
                detalle: error.message 
            });
        }
    },

    // Filtrar habitaciones por precio máximo
    filtrarPorPrecio: async (req, res) => {
        try {
            const { precioMax } = req.params;
            const habitaciones = await Habitacion.findAll({
                where: {
                    precio: {
                        [require('sequelize').Op.lte]: precioMax
                    }
                },
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities'
                }]
            });
            
            res.json(habitaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al filtrar habitaciones por precio',
                detalle: error.message 
            });
        }
    }
};

module.exports = habitacionController;
