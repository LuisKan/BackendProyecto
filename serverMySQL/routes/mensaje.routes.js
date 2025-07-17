const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensaje.controller');

// Rutas CRUD básicas

// GET /api/mensajes - Obtener todos los mensajes
router.get('/', mensajeController.obtenerTodos);

// GET /api/mensajes/:id - Obtener mensaje por ID
router.get('/:id', mensajeController.obtenerPorId);

// POST /api/mensajes - Crear nuevo mensaje
router.post('/', mensajeController.crear);

// PUT /api/mensajes/:id - Actualizar mensaje
router.put('/:id', mensajeController.actualizar);

// DELETE /api/mensajes/:id - Eliminar mensaje
router.delete('/:id', mensajeController.eliminar);

// Rutas específicas

// GET /api/mensajes/conversacion/:conversacionId - Obtener mensajes por conversación
router.get('/conversacion/:conversacionId', mensajeController.obtenerPorConversacion);

// GET /api/mensajes/emisor/:emisorId - Obtener mensajes por emisor
router.get('/emisor/:emisorId', mensajeController.obtenerPorEmisor);

// GET /api/mensajes/buscar/texto - Buscar mensajes por texto
router.get('/buscar/texto', mensajeController.buscarPorTexto);

// GET /api/mensajes/conversacion/:conversacionId/ultimos - Obtener últimos mensajes
router.get('/conversacion/:conversacionId/ultimos', mensajeController.obtenerUltimos);

// GET /api/mensajes/conversacion/:conversacionId/fechas - Obtener mensajes por rango de fechas
router.get('/conversacion/:conversacionId/fechas', mensajeController.obtenerPorFechas);

// GET /api/mensajes/conversacion/:conversacionId/contar - Contar mensajes por conversación
router.get('/conversacion/:conversacionId/contar', mensajeController.contarPorConversacion);

// POST /api/mensajes/enviar - Enviar mensaje con validaciones
router.post('/enviar', mensajeController.enviar);

module.exports = router;
