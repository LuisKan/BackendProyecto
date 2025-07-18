const { Habitacion, HabitacionAmenity } = require('../models');

const habitacionController = {
    // Obtener todas las habitaciones con sus amenities
    obtenerTodas: async (req, res) => {
        try {
            const habitaciones = await Habitacion.findAll({
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities',
                    attributes: ['amenity']
                }]
            });
            
            // Formatear la respuesta para que coincida con el frontend
            const habitacionesFormateadas = habitaciones.map(habitacion => {
                const data = habitacion.toJSON();
                
                // Convertir amenities de objetos a array simple
                data.amenities = data.amenities ? data.amenities.map(a => a.amenity) : [];
                
                // Agregar precioDesglose si existe el precio
                if (data.precio) {
                    const precioMatch = data.precio.match(/\$(\d+)\s*-\s*\$(\d+)/);
                    if (precioMatch) {
                        data.precioDesglose = {
                            corto: precioMatch[1],
                            medio: Math.round((parseInt(precioMatch[1]) + parseInt(precioMatch[2])) / 2).toString(),
                            largo: precioMatch[2]
                        };
                    }
                }
                
                return data;
            });
            
            res.json(habitacionesFormateadas);
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
                    as: 'amenities',
                    attributes: ['amenity']
                }]
            });
            
            if (!habitacion) {
                return res.status(404).json({ error: 'Habitación no encontrada' });
            }
            
            // Formatear la respuesta
            const data = habitacion.toJSON();
            data.amenities = data.amenities ? data.amenities.map(a => a.amenity) : [];
            
            // Agregar precioDesglose si existe el precio
            if (data.precio) {
                const precioMatch = data.precio.match(/\$(\d+)\s*-\s*\$(\d+)/);
                if (precioMatch) {
                    data.precioDesglose = {
                        corto: precioMatch[1],
                        medio: Math.round((parseInt(precioMatch[1]) + parseInt(precioMatch[2])) / 2).toString(),
                        largo: precioMatch[2]
                    };
                }
            }
            
            res.json(data);
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
            const { amenities, precioDesglose, ...habitacionData } = req.body;
            
            // Convertir precioDesglose a formato de precio si está presente
            if (precioDesglose && precioDesglose.corto && precioDesglose.largo) {
                habitacionData.precio = `$${precioDesglose.corto} - $${precioDesglose.largo}`;
            }
            
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
                    as: 'amenities',
                    attributes: ['amenity']
                }]
            });
            
            // Formatear la respuesta
            const data = habitacionCompleta.toJSON();
            data.amenities = data.amenities ? data.amenities.map(a => a.amenity) : [];
            
            // Agregar precioDesglose en la respuesta
            if (precioDesglose) {
                data.precioDesglose = precioDesglose;
            }
            
            res.status(201).json(data);
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
            const { amenities, precioDesglose, ...habitacionData } = req.body;
            
            // Convertir precioDesglose a formato de precio si está presente
            if (precioDesglose && precioDesglose.corto && precioDesglose.largo) {
                habitacionData.precio = `$${precioDesglose.corto} - $${precioDesglose.largo}`;
            }
            
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
                    as: 'amenities',
                    attributes: ['amenity']
                }]
            });
            
            // Formatear la respuesta
            const data = habitacionActualizada.toJSON();
            data.amenities = data.amenities ? data.amenities.map(a => a.amenity) : [];
            
            // Agregar precioDesglose en la respuesta
            if (precioDesglose) {
                data.precioDesglose = precioDesglose;
            } else if (data.precio) {
                const precioMatch = data.precio.match(/\$(\d+)\s*-\s*\$(\d+)/);
                if (precioMatch) {
                    data.precioDesglose = {
                        corto: precioMatch[1],
                        medio: Math.round((parseInt(precioMatch[1]) + parseInt(precioMatch[2])) / 2).toString(),
                        largo: precioMatch[2]
                    };
                }
            }
            
            res.json(data);
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
            
            // Obtener la habitación antes de eliminarla para la respuesta
            const habitacion = await Habitacion.findByPk(id, {
                include: [{
                    model: HabitacionAmenity,
                    as: 'amenities',
                    attributes: ['amenity']
                }]
            });
            
            if (!habitacion) {
                return res.status(404).json({ error: 'Habitación no encontrada' });
            }
            
            // Formatear la habitación para la respuesta
            const habitacionData = habitacion.toJSON();
            habitacionData.amenities = habitacionData.amenities ? habitacionData.amenities.map(a => a.amenity) : [];
            
            // Agregar precioDesglose si existe el precio
            if (habitacionData.precio) {
                const precioMatch = habitacionData.precio.match(/\$(\d+)\s*-\s*\$(\d+)/);
                if (precioMatch) {
                    habitacionData.precioDesglose = {
                        corto: precioMatch[1],
                        medio: Math.round((parseInt(precioMatch[1]) + parseInt(precioMatch[2])) / 2).toString(),
                        largo: precioMatch[2]
                    };
                }
            }
            
            // Eliminar amenities primero
            await HabitacionAmenity.destroy({
                where: { habitacion_id: id }
            });
            
            // Eliminar habitación
            await Habitacion.destroy({
                where: { id }
            });
            
            res.json({ 
                mensaje: 'Habitación eliminada',
                habitacion: habitacionData
            });
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
