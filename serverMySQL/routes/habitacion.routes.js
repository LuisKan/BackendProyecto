const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacion.controller');

// Rutas CRUD básicas

// GET /api/habitaciones - Obtener todas las habitaciones
router.get('/', habitacionController.obtenerTodas);

// GET /api/habitaciones/:id - Obtener habitación por ID
router.get('/:id', habitacionController.obtenerPorId);

// POST /api/habitaciones - Crear nueva habitación
router.post('/', habitacionController.crear);

// PUT /api/habitaciones/:id - Actualizar habitación
router.put('/:id', habitacionController.actualizar);

// DELETE /api/habitaciones/:id - Eliminar habitación
router.delete('/:id', habitacionController.eliminar);

// Rutas específicas

// GET /api/habitaciones/tipo/:tipo - Buscar habitaciones por tipo
router.get('/tipo/:tipo', habitacionController.buscarPorTipo);

// GET /api/habitaciones/precio/:precioMax - Filtrar por precio máximo
router.get('/precio/:precioMax', habitacionController.filtrarPorPrecio);

module.exports = router;
