const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');
const { protect, authorize } = require('../middlewares/autorization.middleware');

// ========== RUTAS PÚBLICAS (Sin autenticación) ==========

// POST /api/v1/personas/register - Registrar nueva persona
router.post('/register', personaController.crear);  

// POST /api/v1/personas/login - Login de persona
router.post('/login', personaController.login);

// ========== RUTAS PROTEGIDAS (Con autenticación) ==========

// GET /api/v1/personas/perfil - Obtener perfil de persona autenticada
router.get('/perfil', protect, personaController.obtenerPerfil);

// ========== RUTAS CRUD BÁSICAS ==========

// GET /api/v1/personas - Obtener todas las personas
router.get('/', personaController.obtenerTodas);

// GET /api/v1/personas/buscar?nombre=... - Buscar personas por nombre
router.get('/buscar', personaController.buscarPorNombre);

// GET /api/v1/personas/:id - Obtener persona por ID
router.get('/:id', personaController.obtenerPorId);

// PUT /api/v1/personas/:id - Actualizar persona (protegida)
router.put('/:id', protect, personaController.actualizar);

// DELETE /api/v1/personas/:id - Eliminar persona (protegida - solo admin)
router.delete('/:id', protect, authorize('admin'), personaController.eliminar);

// ========== RUTAS ESPECÍFICAS ==========

// GET /api/v1/personas/correo/:correo - Buscar por correo
router.get('/correo/:correo', personaController.buscarPorCorreo);

// GET /api/v1/personas/tipo/:tipo - Obtener personas por tipo (admin/usuario)
router.get('/tipo/:tipo', personaController.obtenerPorTipo);

module.exports = router;
