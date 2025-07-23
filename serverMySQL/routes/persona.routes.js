const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');

// Rutas CRUD básicas

// GET /api/personas - Obtener todas las personas
router.get('/', personaController.obtenerTodas);

// GET /api/personas/:id - Obtener persona por ID
router.get('/:id', personaController.obtenerPorId);

// POST /api/personas - Crear nueva persona
router.post('/', personaController.crear);  

// PUT /api/personas/:id - Actualizar persona
router.put('/:id', personaController.actualizar);

// DELETE /api/personas/:id - Eliminar persona
router.delete('/:id', personaController.eliminar);

// Rutas específicas

// GET /api/personas/correo/:correo - Buscar por correo
router.get('/correo/:correo', personaController.buscarPorCorreo);

// GET /api/personas/tipo/:tipo - Obtener personas por tipo (admin/usuario)
router.get('/tipo/:tipo', personaController.obtenerPorTipo);

module.exports = router;
