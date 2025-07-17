const express = require('express');
const router = express.Router();
const participanteConversacionController = require('../controllers/participanteConversacion.controller');

// Rutas principales

// GET /api/participantes-conversacion - Obtener todos los participantes
router.get('/', participanteConversacionController.obtenerTodos);

// GET /api/participantes-conversacion/conversacion/:conversacionId - Obtener participantes por conversación
router.get('/conversacion/:conversacionId', participanteConversacionController.obtenerPorConversacion);

// GET /api/participantes-conversacion/persona/:personaId - Obtener conversaciones por persona
router.get('/persona/:personaId', participanteConversacionController.obtenerPorPersona);

// POST /api/participantes-conversacion - Agregar participante a conversación
router.post('/', participanteConversacionController.crear);

// DELETE /api/participantes-conversacion/:conversacionId/:personaId - Eliminar participante
router.delete('/:conversacionId/:personaId', participanteConversacionController.eliminar);

// DELETE /api/participantes-conversacion/conversacion/:conversacionId - Eliminar todos los participantes de una conversación
router.delete('/conversacion/:conversacionId', participanteConversacionController.eliminarTodosPorConversacion);

// DELETE /api/participantes-conversacion/persona/:personaId - Eliminar persona de todas las conversaciones
router.delete('/persona/:personaId', participanteConversacionController.eliminarPersonaDeTodas);

// Rutas especiales

// POST /api/participantes-conversacion/multiples/:conversacionId - Agregar múltiples participantes
router.post('/multiples/:conversacionId', participanteConversacionController.agregarMultiples);

// GET /api/participantes-conversacion/verificar/:conversacionId/:personaId - Verificar participación
router.get('/verificar/:conversacionId/:personaId', participanteConversacionController.verificarParticipacion);

// GET /api/participantes-conversacion/contar/conversacion/:conversacionId - Contar participantes por conversación
router.get('/contar/conversacion/:conversacionId', participanteConversacionController.contarPorConversacion);

// GET /api/participantes-conversacion/contar/persona/:personaId - Contar conversaciones por persona
router.get('/contar/persona/:personaId', participanteConversacionController.contarPorPersona);

// GET /api/participantes-conversacion/buscar/comunes - Buscar conversaciones comunes entre dos personas
router.get('/buscar/comunes', participanteConversacionController.buscarConversacionesComunes);

// PUT /api/participantes-conversacion/reemplazar/:conversacionId - Reemplazar todos los participantes
router.put('/reemplazar/:conversacionId', participanteConversacionController.reemplazarTodos);

module.exports = router;
