const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// Rutas CRUD básicas

// GET /api/reservas - Obtener todas las reservas
router.get('/', reservaController.obtenerTodas);

// GET /api/reservas/:id - Obtener reserva por ID
router.get('/:id', reservaController.obtenerPorId);

// POST /api/reservas - Crear nueva reserva
router.post('/', reservaController.crear);

// PUT /api/reservas/:id - Actualizar reserva
router.put('/:id', reservaController.actualizar);

// DELETE /api/reservas/:id - Eliminar reserva
router.delete('/:id', reservaController.eliminar);

// Rutas específicas

// GET /api/reservas/usuario/:usuarioId - Obtener reservas por usuario
router.get('/usuario/:usuarioId', reservaController.obtenerPorUsuario);

// GET /api/reservas/habitacion/:habitacionId - Obtener reservas por habitación
router.get('/habitacion/:habitacionId', reservaController.obtenerPorHabitacion);

// GET /api/reservas/estado/:estado - Obtener reservas por estado
router.get('/estado/:estado', reservaController.obtenerPorEstado);

// PATCH /api/reservas/:id/estado - Cambiar estado de reserva
router.patch('/:id/estado', reservaController.cambiarEstado);

// GET /api/reservas/disponibilidad/verificar - Verificar disponibilidad de habitación
router.get('/disponibilidad/verificar', reservaController.verificarDisponibilidad);

module.exports = router;
