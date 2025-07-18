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
            
            // Buscar persona por ID (puede ser numérico o string)
            const persona = await Persona.findByPk(id);
            
            if (!persona) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            
            // Formatear respuesta con ID como string
            const respuesta = {
                id: persona.id.toString(),
                primerNombre: persona.primerNombre,
                segundoNombre: persona.segundoNombre,
                primerApellido: persona.primerApellido,
                prefijo: persona.prefijo,
                numero: persona.numero,
                correo: persona.correo,
                contrasena: persona.contrasena,
                tipo: persona.tipo,
                foto: persona.foto
            };
            
            res.json(respuesta);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error interno del servidor',
                detalle: error.message 
            });
        }
    },

    // Crear nueva persona
    crear: async (req, res) => {
        try {
            // Validar datos requeridos
            const { primerNombre, correo, contrasena } = req.body;
            
            if (!primerNombre || !correo || !contrasena) {
                return res.status(400).json({ 
                    error: 'Datos requeridos faltantes o inválidos' 
                });
            }
            
            const nuevaPersona = await Persona.create(req.body);
            
            // Formatear respuesta con ID como string
            const respuesta = {
                id: nuevaPersona.id.toString(),
                primerNombre: nuevaPersona.primerNombre,
                segundoNombre: nuevaPersona.segundoNombre,
                primerApellido: nuevaPersona.primerApellido,
                prefijo: nuevaPersona.prefijo,
                numero: nuevaPersona.numero,
                correo: nuevaPersona.correo,
                contrasena: nuevaPersona.contrasena,
                tipo: nuevaPersona.tipo,
                foto: nuevaPersona.foto
            };
            
            res.status(201).json(respuesta);
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
            
            // Verificar que la persona existe
            const personaExistente = await Persona.findByPk(id);
            if (!personaExistente) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            
            // Actualizar la persona
            const [filasAfectadas] = await Persona.update(req.body, {
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(400).json({ error: 'Datos inválidos o mal formateados' });
            }
            
            // Obtener la persona actualizada
            const personaActualizada = await Persona.findByPk(id);
            
            // Formatear respuesta según tu Postman
            const respuesta = {
                personas: [{
                    primerNombre: personaActualizada.primerNombre,
                    segundoNombre: personaActualizada.segundoNombre,
                    primerApellido: personaActualizada.primerApellido,
                    prefijo: personaActualizada.prefijo,
                    numero: personaActualizada.numero,
                    correo: personaActualizada.correo,
                    contrasena: personaActualizada.contrasena,
                    tipo: personaActualizada.tipo,
                    foto: personaActualizada.foto
                }],
                id: personaActualizada.id.toString()
            };
            
            res.json(respuesta);
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
            
            // Obtener la persona antes de eliminarla para la respuesta
            const persona = await Persona.findByPk(id);
            
            if (!persona) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            
            // Eliminar la persona
            await Persona.destroy({
                where: { id }
            });
            
            // Respuesta según el formato de tu Postman
            res.json({ 
                mensaje: 'Persona eliminada correctamente',
                persona: {
                    id: persona.id.toString(),
                    primerNombre: persona.primerNombre,
                    segundoNombre: persona.segundoNombre,
                    primerApellido: persona.primerApellido,
                    prefijo: persona.prefijo,
                    numero: persona.numero,
                    correo: persona.correo,
                    contrasena: persona.contrasena,
                    tipo: persona.tipo,
                    foto: persona.foto
                }
            });
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
