const express = require('express');
const router = express.Router();
const habitacionAmenityController = require('../controllers/habitacionAmenity.controller');

// Rutas principales

// GET /api/habitacion-amenities - Obtener todos los amenities
router.get('/', habitacionAmenityController.obtenerTodos);

// GET /api/habitacion-amenities/habitacion/:habitacionId - Obtener amenities por habitación
router.get('/habitacion/:habitacionId', habitacionAmenityController.obtenerPorHabitacion);

// GET /api/habitacion-amenities/amenity/:amenity - Obtener habitaciones por amenity
router.get('/amenity/:amenity', habitacionAmenityController.obtenerHabitacionesPorAmenity);

// POST /api/habitacion-amenities - Crear nuevo amenity
router.post('/', habitacionAmenityController.crear);

// DELETE /api/habitacion-amenities/:habitacionId/:amenity - Eliminar amenity específico
router.delete('/:habitacionId/:amenity', habitacionAmenityController.eliminar);

// DELETE /api/habitacion-amenities/habitacion/:habitacionId - Eliminar todos los amenities de una habitación
router.delete('/habitacion/:habitacionId', habitacionAmenityController.eliminarTodosPorHabitacion);

// Rutas especiales

// POST /api/habitacion-amenities/multiples/:habitacionId - Agregar múltiples amenities
router.post('/multiples/:habitacionId', habitacionAmenityController.agregarMultiples);

// PUT /api/habitacion-amenities/reemplazar/:habitacionId - Reemplazar todos los amenities
router.put('/reemplazar/:habitacionId', habitacionAmenityController.reemplazarTodos);

// GET /api/habitacion-amenities/unicos - Obtener lista de amenities únicos
router.get('/unicos', habitacionAmenityController.obtenerAmenitiesUnicos);

// GET /api/habitacion-amenities/buscar/multiples - Buscar habitaciones por múltiples amenities
router.get('/buscar/multiples', habitacionAmenityController.buscarHabitacionesPorMultiplesAmenities);

module.exports = router;
