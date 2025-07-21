const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacion.controller');

// Rutas compatibles con Postman Collection

// GET /api/v1/notificaciones/usuario/{id_usuario} - Obtener notificaciones por usuario
// DEBE IR ANTES que /:id para evitar conflictos de rutas
router.get('/usuario/:id_usuario', notificacionController.obtenerPorUsuario);

// GET /api/v1/notificaciones/{id} - Obtener notificación por ID
router.get('/:id', notificacionController.obtenerPorId);

// POST /api/v1/notificaciones - Crear nueva notificación
router.post('/', notificacionController.crear);

// PUT /api/v1/notificaciones/{id} - Actualizar notificación (cambiar estado)
router.put('/:id', notificacionController.actualizar);

// DELETE /api/v1/notificaciones/{id} - Eliminar notificación
router.delete('/:id', notificacionController.eliminar);


module.exports = router;
