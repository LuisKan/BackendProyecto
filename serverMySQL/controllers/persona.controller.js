require("dotenv").config(); 
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcryptjs");
const { Persona } = require('../models');
const { Op } = require('sequelize');

// Función para generar JWT token
const generateToken = (id) => { 
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // El token expirará en 30 días
    });
}

const personaController = {
    // Obtener todas las personas (sin contraseñas)
    obtenerTodas: async (req, res) => {
        try {
            const personas = await Persona.findAll({
                attributes: { exclude: ['contrasena'] } // Excluir contraseña de la respuesta
            });
            res.json(personas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las personas',
                detalle: error.message 
            });
        }
    },

    // Obtener persona por ID (sin contraseña)
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Buscar persona por ID (sin contraseña)
            const persona = await Persona.findByPk(id, {
                attributes: { exclude: ['contrasena'] } // Excluir contraseña de la respuesta
            });
            
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

    // Crear nueva persona con hash de contraseña
    crear: async (req, res) => {
        try {
            // Validar datos requeridos
            const { primerNombre, correo, contrasena } = req.body;
            
            if (!primerNombre || !correo || !contrasena) {
                return res.status(400).json({ 
                    error: 'Los campos primerNombre, correo y contrasena son obligatorios' 
                });
            }

            // Verificar si el correo ya existe
            const existente = await Persona.findOne({ where: { correo } });
            if (existente) {
                return res.status(409).json({ 
                    error: "Ya existe una persona con ese correo electrónico" 
                });
            }

            // Hash de la contraseña antes de guardarla
            const salt = await bcrypt.genSalt(10);
            const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

            // Crear persona con contraseña hasheada
            const datosPersona = {
                ...req.body,
                contrasena: contrasenaHasheada
            };

            const nuevaPersona = await Persona.create(datosPersona);
            
            // Generar token JWT
            const token = generateToken(nuevaPersona.id);

            // Formatear respuesta sin contraseña y con token
            const respuesta = {
                id: nuevaPersona.id.toString(),
                primerNombre: nuevaPersona.primerNombre,
                segundoNombre: nuevaPersona.segundoNombre,
                primerApellido: nuevaPersona.primerApellido,
                prefijo: nuevaPersona.prefijo,
                numero: nuevaPersona.numero,
                correo: nuevaPersona.correo,
                tipo: nuevaPersona.tipo,
                foto: nuevaPersona.foto,
                token: token
            };
            
            res.status(201).json(respuesta);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: 'El correo ya está registrado' 
                });
            }
            if (error.name === 'SequelizeValidationError') {
                const errores = error.errors.map(error => error.message);
                return res.status(400).json({ 
                    error: "Error de validación", 
                    detalles: errores 
                });
            }
            res.status(500).json({ 
                error: 'Error al crear la persona',
                detalle: error.message 
            });
        }
    },

    // Actualizar persona con hash de contraseña si se proporciona
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { correo, contrasena } = req.body;
            
            // Verificar que la persona existe
            const personaExistente = await Persona.findByPk(id);
            if (!personaExistente) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }

            // Verificar si el correo ya existe (excepto para la persona actual)
            if (correo) {
                const existente = await Persona.findOne({ 
                    where: { 
                        correo: correo,
                        id: { [Op.ne]: id }
                    } 
                });
                if (existente) {
                    return res.status(409).json({ 
                        error: "Ya existe otra persona con ese correo electrónico" 
                    });
                }
            }

            // Preparar datos para actualizar
            const datosActualizacion = { ...req.body };
            
            // Si se proporciona una nueva contraseña, hashearla
            if (contrasena) {
                const salt = await bcrypt.genSalt(10);
                datosActualizacion.contrasena = await bcrypt.hash(contrasena, salt);
            }
            
            // Actualizar la persona
            const [filasAfectadas] = await Persona.update(datosActualizacion, {
                where: { id }
            });
            
            if (filasAfectadas === 0) {
                return res.status(400).json({ error: 'Datos inválidos o mal formateados' });
            }
            
            // Obtener la persona actualizada (sin contraseña)
            const personaActualizada = await Persona.findByPk(id, {
                attributes: { exclude: ['contrasena'] }
            });
            
            // Formatear respuesta según tu formato actual
            const respuesta = {
                personas: [{
                    primerNombre: personaActualizada.primerNombre,
                    segundoNombre: personaActualizada.segundoNombre,
                    primerApellido: personaActualizada.primerApellido,
                    prefijo: personaActualizada.prefijo,
                    numero: personaActualizada.numero,
                    correo: personaActualizada.correo,
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
            if (error.name === 'SequelizeValidationError') {
                const errores = error.errors.map(error => error.message);
                return res.status(400).json({ 
                    error: "Error de validación", 
                    detalles: errores 
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

    // Buscar por correo (sin contraseña)
    buscarPorCorreo: async (req, res) => {
        try {
            const { correo } = req.params;
            const persona = await Persona.findOne({
                where: { correo },
                attributes: { exclude: ['contrasena'] } // Excluir contraseña de la respuesta
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

    // Obtener personas por tipo (sin contraseñas)
    obtenerPorTipo: async (req, res) => {
        try {
            const { tipo } = req.params;
            const personas = await Persona.findAll({
                where: { tipo },
                attributes: { exclude: ['contrasena'] } // Excluir contraseña de la respuesta
            });
            
            res.json(personas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las personas por tipo',
                detalle: error.message 
            });
        }
    },

    // ========== NUEVOS MÉTODOS DE AUTENTICACIÓN ==========

    // Login de persona (autenticación con bcrypt y JWT)
    login: async (req, res) => {
        try {
            const { correo, contrasena } = req.body;

            if (!correo || !contrasena) {
                return res.status(400).json({ 
                    error: "Los campos 'correo' y 'contrasena' son obligatorios" 
                });
            }

            // Buscar persona por correo
            const persona = await Persona.findOne({ where: { correo } });
            if (!persona) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            // Verificar la contraseña usando bcrypt
            const contrasenaValida = await bcrypt.compare(contrasena, persona.contrasena);
            if (!contrasenaValida) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            // Generar token JWT
            const token = generateToken(persona.id);

            // Respuesta sin contraseña y con token
            const respuesta = {
                message: "Login exitoso",
                persona: {
                    id: persona.id.toString(),
                    primerNombre: persona.primerNombre,
                    segundoNombre: persona.segundoNombre,
                    primerApellido: persona.primerApellido,
                    prefijo: persona.prefijo,
                    numero: persona.numero,
                    correo: persona.correo,
                    tipo: persona.tipo,
                    foto: persona.foto
                },
                token: token
            };

            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).json({ 
                error: "Error al autenticar persona",
                detalle: error.message 
            });
        }
    },

    // Obtener perfil de la persona autenticada
    obtenerPerfil: async (req, res) => {
        try {
            // req.persona viene del middleware protect
            const persona = await Persona.findByPk(req.persona.id, {
                attributes: { exclude: ['contrasena'] }
            });
            
            if (!persona) {
                return res.status(404).json({ error: "Persona no encontrada" });
            }
            
            const respuesta = {
                id: persona.id.toString(),
                primerNombre: persona.primerNombre,
                segundoNombre: persona.segundoNombre,
                primerApellido: persona.primerApellido,
                prefijo: persona.prefijo,
                numero: persona.numero,
                correo: persona.correo,
                tipo: persona.tipo,
                foto: persona.foto
            };
            
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).json({ 
                error: "Error al obtener el perfil",
                detalle: error.message 
            });
        }
    },

    // Buscar personas por nombre (sin contraseñas)
    buscarPorNombre: async (req, res) => {
        try {
            const { nombre } = req.query;

            if (!nombre) {
                return res.status(400).json({ 
                    error: "El parámetro 'nombre' es requerido" 
                });
            }

            const personas = await Persona.findAll({ 
                where: { 
                    [Op.or]: [
                        { primerNombre: { [Op.iLike]: `%${nombre}%` } },
                        { segundoNombre: { [Op.iLike]: `%${nombre}%` } },
                        { primerApellido: { [Op.iLike]: `%${nombre}%` } }
                    ]
                },
                attributes: { exclude: ['contrasena'] } // Excluir contraseña
            });
            
            res.status(200).json(personas);
        } catch (error) {
            res.status(500).json({ 
                error: "Error al buscar personas por nombre",
                detalle: error.message 
            });
        }
    }
};

module.exports = personaController;
