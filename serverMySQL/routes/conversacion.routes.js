const express = require('express');
const router = express.Router();
const conversacionController = require('../controllers/conversacion.controller');

// Rutas CRUD básicas

// GET /api/conversaciones - Obtener todas las conversaciones
router.get('/', conversacionController.obtenerTodas);

// GET /api/conversaciones/:id - Obtener conversación por ID
router.get('/:id', conversacionController.obtenerPorId);

// POST /api/conversaciones - Crear nueva conversación
router.post('/', conversacionController.crear);

// DELETE /api/conversaciones/:id - Eliminar conversación
router.delete('/:id', conversacionController.eliminar);

// Rutas específicas para mensajes dentro de conversaciones

// POST /api/v1/conversaciones/:id/mensajes - Enviar mensaje a conversación
router.post('/:id/mensajes', conversacionController.enviarMensaje);

// PUT /api/v1/conversaciones/:idConversacion/mensajes/:idMensaje - Editar mensaje
router.put('/:idConversacion/mensajes/:idMensaje', conversacionController.editarMensaje);

// DELETE /api/v1/conversaciones/:id/mensajes/:mensajeId - Eliminar mensaje
router.delete('/:id/mensajes/:mensajeId', conversacionController.eliminarMensaje);

// Rutas específicas

// GET /api/conversaciones/persona/:personaId - Obtener conversaciones de una persona
router.get('/persona/:personaId', conversacionController.obtenerPorPersona);

// POST /api/conversaciones/:id/participante - Agregar participante a conversación
router.post('/:id/participante', conversacionController.agregarParticipante);

// DELETE /api/conversaciones/:id/participante - Remover participante de conversación
router.delete('/:id/participante', conversacionController.removerParticipante);

// GET /api/conversaciones/buscar/entre-personas - Buscar conversación entre dos personas
router.get('/buscar/entre-personas', conversacionController.buscarEntrePersonas);

module.exports = router;
