const { Persona } = require('../models');

const personaController = {
    // Obtener todas las personas
    obtenerTodas: async (req, res) => {
        try {
            const personas = await Persona.findAll();
            res.json(personas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las personas',
                detalle: error.message 
            });
        }
    },

    // Obtener persona por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const persona = await Persona.findByPk(id);
            
            if (!persona) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            
            res.json(persona);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener la persona',
                detalle: error.message 
            });
        }
    },

    // Crear nueva persona
    crear: async (req, res) => {
        try {
            const nuevaPersona = await Persona.create(req.body);
            res.status(201).json(nuevaPersona);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: 'El correo ya está registrado' 
                });
            }
            res.status(500).json({ 
                error: 'Error al crear la persona',
                detalle: error.message 
            });
        }
    },

    // Actualizar persona
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const [filasAfectadas] = await Persona.update(req.body, {
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            
            const personaActualizada = await Persona.findByPk(id);
            res.json(personaActualizada);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: 'El correo ya está registrado' 
                });
            }
            res.status(500).json({ 
                error: 'Error al actualizar la persona',
                detalle: error.message 
            });
        }
    },

    // Eliminar persona
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const filasAfectadas = await Persona.destroy({
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            
            res.json({ mensaje: 'Persona eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar la persona',
                detalle: error.message 
            });
        }
    },

    // Buscar por correo
    buscarPorCorreo: async (req, res) => {
        try {
            const { correo } = req.params;
            const persona = await Persona.findOne({
                where: { correo }
            });
            
            if (!persona) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            
            res.json(persona);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al buscar la persona',
                detalle: error.message 
            });
        }
    },

    // Obtener personas por tipo
    obtenerPorTipo: async (req, res) => {
        try {
            const { tipo } = req.params;
            const personas = await Persona.findAll({
                where: { tipo }
            });
            
            res.json(personas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las personas por tipo',
                detalle: error.message 
            });
        }
    }
};

module.exports = personaController;
