const express = require('express');
const router = express.Router();
const conversacionController = require('../controllers/conversacion.controller');
const { protect, authorize } = require('../middlewares/autorization.middleware');

// ========== RUTAS PROTEGIDAS (Todas las conversaciones requieren autenticación) ==========

// GET /api/v1/conversaciones - Obtener todas las conversaciones
router.get('/', protect, conversacionController.obtenerTodas);

// GET /api/v1/conversaciones/:id - Obtener conversación por ID
router.get('/:id', protect, conversacionController.obtenerPorId);

// POST /api/v1/conversaciones - Crear nueva conversación
router.post('/', protect, conversacionController.crear);

// DELETE /api/v1/conversaciones/:id - Eliminar conversación
router.delete('/:id', protect, conversacionController.eliminar);

// ========== RUTAS DE MENSAJES (Protegidas) ==========

// POST /api/v1/conversaciones/:id/mensajes - Enviar mensaje a conversación
router.post('/:id/mensajes', protect, conversacionController.enviarMensaje);

// PUT /api/v1/conversaciones/:idConversacion/mensajes/:idMensaje - Editar mensaje
router.put('/:idConversacion/mensajes/:idMensaje', protect, conversacionController.editarMensaje);

// DELETE /api/v1/conversaciones/:id/mensajes/:mensajeId - Eliminar mensaje
router.delete('/:id/mensajes/:mensajeId', protect, conversacionController.eliminarMensaje);

// ========== RUTAS ESPECÍFICAS (Protegidas) ==========

// GET /api/v1/conversaciones/persona/:personaId - Obtener conversaciones de una persona
router.get('/persona/:personaId', protect, conversacionController.obtenerPorPersona);

// POST /api/v1/conversaciones/:id/participante - Agregar participante a conversación
router.post('/:id/participante', protect, conversacionController.agregarParticipante);

// DELETE /api/v1/conversaciones/:id/participante - Remover participante de conversación
router.delete('/:id/participante', protect, conversacionController.removerParticipante);

// GET /api/v1/conversaciones/buscar/entre-personas - Buscar conversación entre dos personas
router.get('/buscar/entre-personas', protect, conversacionController.buscarEntrePersonas);

module.exports = router;
