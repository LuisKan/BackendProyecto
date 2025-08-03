const express = require('express');
const router = express.Router();
const conversacionController = require('../controllers/conversacion.controller');
const { protect, authorize } = require('../middlewares/autorization.middleware');

// ========== RUTAS PRINCIPALES DE CHAT (Protegidas) ==========

// POST /api/conversaciones/buscar-o-crear - Buscar o crear conversación entre dos personas
router.post('/buscar-o-crear', protect, conversacionController.buscarOCrearConversacion);

// GET /api/conversaciones/usuario/:userId - Obtener conversaciones de un usuario
router.get('/usuario/:userId', protect, conversacionController.obtenerConversacionesUsuario);

// GET /api/conversaciones/:id/mensajes - Obtener mensajes de una conversación
router.get('/:id/mensajes', protect, conversacionController.obtenerMensajesConversacion);

// POST /api/conversaciones/:id/mensajes - Enviar mensaje a conversación
router.post('/:id/mensajes', protect, conversacionController.enviarMensaje);

// DELETE /api/conversaciones/:id - Eliminar conversación completa
router.delete('/:id', protect, conversacionController.eliminarConversacion);

module.exports = router;
