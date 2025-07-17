const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacion.controller');

// Rutas CRUD básicas

// GET /api/notificaciones - Obtener todas las notificaciones
router.get('/', notificacionController.obtenerTodas);

// GET /api/notificaciones/:id - Obtener notificación por ID
router.get('/:id', notificacionController.obtenerPorId);

// POST /api/notificaciones - Crear nueva notificación
router.post('/', notificacionController.crear);

// PUT /api/notificaciones/:id - Actualizar notificación
router.put('/:id', notificacionController.actualizar);

// DELETE /api/notificaciones/:id - Eliminar notificación
router.delete('/:id', notificacionController.eliminar);

// Rutas específicas

// GET /api/notificaciones/usuario/:usuarioId - Obtener notificaciones por usuario
router.get('/usuario/:usuarioId', notificacionController.obtenerPorUsuario);

// GET /api/notificaciones/tipo/:tipo - Obtener notificaciones por tipo
router.get('/tipo/:tipo', notificacionController.obtenerPorTipo);

// PATCH /api/notificaciones/:id/leida - Marcar notificación como leída
router.patch('/:id/leida', notificacionController.marcarComoLeida);

// PATCH /api/notificaciones/usuario/:usuarioId/leer-todas - Marcar todas como leídas por usuario
router.patch('/usuario/:usuarioId/leer-todas', notificacionController.marcarTodasComoLeidasPorUsuario);

// POST /api/notificaciones/reserva - Crear notificación para reserva
router.post('/reserva', notificacionController.crearParaReserva);

module.exports = router;
