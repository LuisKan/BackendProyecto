const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// Rutas compatibles con Postman Collection
// Nota: Las rutas se montan en /api/v1/reservas, por lo que:
// - /api/v1/reservas/mis-reservas será GET /mis-reservas 
// - /api/v1/reservas/ será POST /reservas
// - etc.

// GET /api/v1/reservas/ - Obtener todas las reservas
router.get('/', reservaController.obtenerTodas);
// GET /api/v1/reservas/ - Obtener reservas del usuario autenticado
router.get('/:id', reservaController.obtenerPorId);

// POST /api/v1/reservas/ - Crear nueva reserva  
router.post('/', reservaController.crear);

// PUT /api/v1/reservas/{id} - Actualizar reserva
router.put('/:id', reservaController.actualizar);

// DELETE /api/v1/reservas/{id} - Eliminar reserva
router.delete('/:id', reservaController.eliminar);

module.exports = router;
