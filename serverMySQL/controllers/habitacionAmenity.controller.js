const { HabitacionAmenity, Habitacion } = require('../models');

const habitacionAmenityController = {
    // Obtener todos los amenities
    obtenerTodos: async (req, res) => {
        try {
            const amenities = await HabitacionAmenity.findAll({
                include: [{
                    model: Habitacion,
                    as: 'habitacion'
                }]
            });
            res.json(amenities);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los amenities',
                detalle: error.message 
            });
        }
    },

    // Obtener amenities por habitación
    obtenerPorHabitacion: async (req, res) => {
        try {
            const { habitacionId } = req.params;
            const amenities = await HabitacionAmenity.findAll({
                where: { habitacion_id: habitacionId },
                include: [{
                    model: Habitacion,
                    as: 'habitacion'
                }]
            });
            
            res.json(amenities);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los amenities de la habitación',
                detalle: error.message 
            });
        }
    },

    // Obtener habitaciones que tienen un amenity específico
    obtenerHabitacionesPorAmenity: async (req, res) => {
        try {
            const { amenity } = req.params;
            const habitacionesConAmenity = await HabitacionAmenity.findAll({
                where: { amenity },
                include: [{
                    model: Habitacion,
                    as: 'habitacion'
                }]
            });
            
            res.json(habitacionesConAmenity);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las habitaciones por amenity',
                detalle: error.message 
            });
        }
    },

    // Crear nuevo amenity para una habitación
    crear: async (req, res) => {
        try {
            const nuevoAmenity = await HabitacionAmenity.create(req.body);
            
            // Obtener el amenity completo con la habitación
            const amenityCompleto = await HabitacionAmenity.findOne({
                where: {
                    habitacion_id: nuevoAmenity.habitacion_id,
                    amenity: nuevoAmenity.amenity
                },
                include: [{
                    model: Habitacion,
                    as: 'habitacion'
                }]
            });
            
            res.status(201).json(amenityCompleto);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: 'Este amenity ya existe para esta habitación' 
                });
            }
            res.status(500).json({ 
                error: 'Error al crear el amenity',
                detalle: error.message 
            });
        }
    },

    // Eliminar amenity específico de una habitación
    eliminar: async (req, res) => {
        try {
            const { habitacionId, amenity } = req.params;
            
            const filasAfectadas = await HabitacionAmenity.destroy({
                where: { 
                    habitacion_id: habitacionId,
                    amenity: amenity
                }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Amenity no encontrado para esta habitación' });
            }
            
            res.json({ mensaje: 'Amenity eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar el amenity',
                detalle: error.message 
            });
        }
    },

    // Eliminar todos los amenities de una habitación
    eliminarTodosPorHabitacion: async (req, res) => {
        try {
            const { habitacionId } = req.params;
            
            const filasAfectadas = await HabitacionAmenity.destroy({
                where: { habitacion_id: habitacionId }
            });
            
            res.json({ 
                mensaje: `${filasAfectadas} amenities eliminados de la habitación` 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar los amenities de la habitación',
                detalle: error.message 
            });
        }
    },

    // Agregar múltiples amenities a una habitación
    agregarMultiples: async (req, res) => {
        try {
            const { habitacionId } = req.params;
            const { amenities } = req.body;
            
            if (!amenities || !Array.isArray(amenities)) {
                return res.status(400).json({ 
                    error: 'Se requiere un array de amenities' 
                });
            }
            
            // Preparar datos para inserción masiva
            const amenitiesData = amenities.map(amenity => ({
                habitacion_id: habitacionId,
                amenity
            }));
            
            const nuevosAmenities = await HabitacionAmenity.bulkCreate(
                amenitiesData,
                { ignoreDuplicates: true } // Ignora duplicados
            );
            
            // Obtener todos los amenities de la habitación
            const amenitiesCompletos = await HabitacionAmenity.findAll({
                where: { habitacion_id: habitacionId },
                include: [{
                    model: Habitacion,
                    as: 'habitacion'
                }]
            });
            
            res.status(201).json({
                mensaje: `${nuevosAmenities.length} amenities agregados`,
                amenities: amenitiesCompletos
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al agregar múltiples amenities',
                detalle: error.message 
            });
        }
    },

    // Reemplazar todos los amenities de una habitación
    reemplazarTodos: async (req, res) => {
        try {
            const { habitacionId } = req.params;
            const { amenities } = req.body;
            
            if (!amenities || !Array.isArray(amenities)) {
                return res.status(400).json({ 
                    error: 'Se requiere un array de amenities' 
                });
            }
            
            // Eliminar amenities existentes
            await HabitacionAmenity.destroy({
                where: { habitacion_id: habitacionId }
            });
            
            // Agregar nuevos amenities
            if (amenities.length > 0) {
                const amenitiesData = amenities.map(amenity => ({
                    habitacion_id: habitacionId,
                    amenity
                }));
                
                await HabitacionAmenity.bulkCreate(amenitiesData);
            }
            
            // Obtener todos los amenities actualizados
            const amenitiesActualizados = await HabitacionAmenity.findAll({
                where: { habitacion_id: habitacionId },
                include: [{
                    model: Habitacion,
                    as: 'habitacion'
                }]
            });
            
            res.json({
                mensaje: 'Amenities reemplazados correctamente',
                amenities: amenitiesActualizados
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al reemplazar los amenities',
                detalle: error.message 
            });
        }
    },

    // Obtener lista única de todos los amenities disponibles
    obtenerAmenitiesUnicos: async (req, res) => {
        try {
            const { QueryTypes } = require('sequelize');
            const sequelize = require('../config/sequelize.config.js');
            
            const amenitiesUnicos = await sequelize.query(
                'SELECT DISTINCT amenity FROM HabitacionAmenities ORDER BY amenity',
                { type: QueryTypes.SELECT }
            );
            
            res.json(amenitiesUnicos.map(item => item.amenity));
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener amenities únicos',
                detalle: error.message 
            });
        }
    },

    // Buscar habitaciones por múltiples amenities
    buscarHabitacionesPorMultiplesAmenities: async (req, res) => {
        try {
            const { amenities } = req.query; // Esperamos una cadena separada por comas
            
            if (!amenities) {
                return res.status(400).json({ 
                    error: 'Se requiere al menos un amenity para buscar' 
                });
            }
            
            const amenitiesList = amenities.split(',').map(a => a.trim());
            const { QueryTypes } = require('sequelize');
            const sequelize = require('../config/sequelize.config.js');
            
            // Buscar habitaciones que tengan TODOS los amenities solicitados
            const habitaciones = await sequelize.query(`
                SELECT h.*, COUNT(ha.amenity) as amenities_match
                FROM Habitaciones h
                INNER JOIN HabitacionAmenities ha ON h.id = ha.habitacion_id
                WHERE ha.amenity IN (:amenities)
                GROUP BY h.id
                HAVING COUNT(DISTINCT ha.amenity) = :totalAmenities
            `, {
                replacements: { 
                    amenities: amenitiesList,
                    totalAmenities: amenitiesList.length 
                },
                type: QueryTypes.SELECT
            });
            
            res.json(habitaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al buscar habitaciones por múltiples amenities',
                detalle: error.message 
            });
        }
    }
};

module.exports = habitacionAmenityController;
