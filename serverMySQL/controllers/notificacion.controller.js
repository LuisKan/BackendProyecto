const { Notificacion, Persona } = require('../models');

const notificacionController = {
    // Obtener notificación por ID - Formato Postman
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const notificacion = await Notificacion.findByPk(id);
            
            if (!notificacion) {
                return res.status(404).json({ 
                    error: 'Notificación no encontrada' 
                });
            }
            
            // Formatear respuesta según especificación Postman
            const respuesta = {
                id: notificacion.id.toString(),
                id_usuario: notificacion.usuarioId.toString(),
                tipo: notificacion.tipo || "sistema",
                estado: notificacion.tipo === "leida" ? "leído" : "sin leer",
                titulo: notificacion.texto || "",
                fecha: notificacion.fecha ? new Date(notificacion.fecha).toISOString() : new Date().toISOString()
            };
            
            res.json(respuesta);
        } catch (error) {
            console.error('Error al obtener notificación:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor'
            });
        }
    },

    // Obtener todas las notificaciones de un usuario - Formato Postman
    obtenerPorUsuario: async (req, res) => {
        try {
            const { id_usuario } = req.params;
            
            // Verificar que el usuario existe
            const usuario = await Persona.findByPk(id_usuario);
            if (!usuario) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            
            const notificaciones = await Notificacion.findAll({
                where: { usuarioId: id_usuario },
                order: [['fecha', 'DESC']]
            });
            
            // Formatear respuesta según especificación Postman
            const respuesta = notificaciones.map(notif => ({
                id: notif.id.toString(),
                id_usuario: notif.usuarioId.toString(),
                tipo: notif.tipo === "leida" ? "sistema" : (notif.tipo || "mensaje"),
                estado: notif.tipo === "leida" ? "leído" : "sin leer",
                titulo: notif.texto || "",
                fecha: notif.fecha ? new Date(notif.fecha).toISOString() : new Date().toISOString()
            }));
            
            res.json(respuesta);
        } catch (error) {
            console.error('Error al obtener notificaciones del usuario:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor'
            });
        }
    },

    // Crear nueva notificación - Formato Postman
    crear: async (req, res) => {
        try {
            const { id_usuario, tipo, estado, titulo, fecha } = req.body;
            
            // Validar campos requeridos
            if (!id_usuario || !tipo || !estado || !titulo) {
                return res.status(400).json({ 
                    error: 'Datos requeridos faltantes o inválidos'
                });
            }
            
            // Verificar que el usuario existe
            const usuario = await Persona.findByPk(id_usuario);
            if (!usuario) {
                return res.status(400).json({ 
                    error: 'Datos requeridos faltantes o inválidos'
                });
            }
            
            // Convertir estado a tipo interno
            const tipoInterno = estado === "leído" ? "leida" : tipo;
            
            const nuevaNotificacion = await Notificacion.create({
                usuarioId: id_usuario,
                texto: titulo,
                tipo: tipoInterno,
                fecha: fecha ? new Date(fecha) : new Date()
            });
            
            // Formatear respuesta según especificación Postman
            const respuesta = {
                id: nuevaNotificacion.id.toString(),
                id_usuario: nuevaNotificacion.usuarioId.toString(),
                tipo: tipo,
                estado: estado,
                titulo: nuevaNotificacion.texto,
                fecha: nuevaNotificacion.fecha ? new Date(nuevaNotificacion.fecha).toISOString() : new Date().toISOString()
            };
            
            res.status(201).json(respuesta);
        } catch (error) {
            console.error('Error al crear notificación:', error);
            res.status(500).json({ 
                error: 'Error al intentar registrar la notificación'
            });
        }
    },

    // Actualizar notificación - Formato Postman
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            // Validar campo estado
            if (!estado) {
                return res.status(400).json({ 
                    error: "Campo 'estado' inválido o faltante"
                });
            }
            
            if (estado !== "leído" && estado !== "sin leer") {
                return res.status(400).json({ 
                    error: "Campo 'estado' inválido o faltante"
                });
            }
            
            // Buscar la notificación
            const notificacion = await Notificacion.findByPk(id);
            if (!notificacion) {
                return res.status(404).json({ 
                    error: 'Notificación no encontrada' 
                });
            }
            
            // Convertir estado a tipo interno
            const tipoInterno = estado === "leído" ? "leida" : (notificacion.tipo === "leida" ? "mensaje" : notificacion.tipo);
            
            // Actualizar la notificación
            await Notificacion.update(
                { tipo: tipoInterno },
                { where: { id } }
            );
            
            // Obtener la notificación actualizada
            const notificacionActualizada = await Notificacion.findByPk(id);
            
            // Formatear respuesta según especificación Postman
            const respuesta = {
                id: notificacionActualizada.id.toString(),
                id_usuario: notificacionActualizada.usuarioId.toString(),
                tipo: notificacionActualizada.tipo === "leida" ? "sistema" : (notificacionActualizada.tipo || "mensaje"),
                estado: estado,
                titulo: notificacionActualizada.texto || "",
                fecha: notificacionActualizada.fecha ? new Date(notificacionActualizada.fecha).toISOString() : new Date().toISOString()
            };
            
            res.json(respuesta);
        } catch (error) {
            console.error('Error al actualizar notificación:', error);
            res.status(500).json({ 
                error: 'Error al intentar actualizar la notificación'
            });
        }
    },

    // Eliminar notificación - Formato Postman
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Buscar la notificación antes de eliminarla
            const notificacion = await Notificacion.findByPk(id);
            if (!notificacion) {
                return res.status(404).json({ 
                    error: 'Notificación no encontrada' 
                });
            }
            
            // Eliminar la notificación
            await Notificacion.destroy({
                where: { id }
            });
            
            // Formatear respuesta según especificación Postman
            const respuesta = {
                mensaje: "Notificación eliminada correctamente",
                notificacion: {
                    id: "",
                    id_usuario: "",
                    tipo: "",
                    estado: "",
                    titulo: "",
                    fecha: ""
                }
            };
            
            res.json(respuesta);
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
            res.status(500).json({ 
                error: 'Error al intentar eliminar la notificación'
            });
        }
    }
};

module.exports = notificacionController;
