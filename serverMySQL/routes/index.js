const express = require('express');
const router = express.Router();

// Importar todas las rutas
const personaRoutes = require('./persona.routes');
const habitacionRoutes = require('./habitacion.routes');
const habitacionAmenityRoutes = require('./habitacionAmenity.routes');
const reservaRoutes = require('./reserva.routes');
const notificacionRoutes = require('./notificacion.routes');
const conversacionRoutes = require('./conversacion.routes');
const participanteConversacionRoutes = require('./participanteConversacion.routes');
const mensajeRoutes = require('./mensaje.routes');

// Configurar rutas con sus prefijos
router.use('/personas', personaRoutes);
router.use('/habitaciones', habitacionRoutes);
router.use('/habitacion-amenities', habitacionAmenityRoutes);
router.use('/reservas', reservaRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/conversaciones', conversacionRoutes);
router.use('/participantes-conversacion', participanteConversacionRoutes);
router.use('/mensajes', mensajeRoutes);

// Ruta de estado de la API
router.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'HostelDB API funcionando correctamente',
        timestamp: new Date().toISOString(),
        endpoints: {
            personas: '/api/personas',
            habitaciones: '/api/habitaciones',
            habitacionAmenities: '/api/habitacion-amenities',
            reservas: '/api/reservas',
            notificaciones: '/api/notificaciones',
            conversaciones: '/api/conversaciones',
            participantesConversacion: '/api/participantes-conversacion',
            mensajes: '/api/mensajes'
        }
    });
});

// Ruta de documentación básica
router.get('/docs', (req, res) => {
    res.json({
        api: 'HostelDB API',
        version: '1.0.0',
        description: 'API REST para sistema de gestión de hostel',
        endpoints: {
            '/api/personas': {
                description: 'Gestión de usuarios y administradores',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                especiales: [
                    'GET /api/personas/correo/:correo',
                    'GET /api/personas/tipo/:tipo'
                ]
            },
            '/api/habitaciones': {
                description: 'Gestión de habitaciones',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                especiales: [
                    'GET /api/habitaciones/tipo/:tipo',
                    'GET /api/habitaciones/precio/:precioMax'
                ]
            },
            '/api/habitacion-amenities': {
                description: 'Gestión de amenities de habitaciones',
                methods: ['GET', 'POST', 'DELETE'],
                especiales: [
                    'GET /api/habitacion-amenities/unicos',
                    'GET /api/habitacion-amenities/buscar/multiples'
                ]
            },
            '/api/reservas': {
                description: 'Gestión de reservas',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                especiales: [
                    'GET /api/reservas/disponibilidad/verificar',
                    'PATCH /api/reservas/:id/estado'
                ]
            },
            '/api/notificaciones': {
                description: 'Gestión de notificaciones',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                especiales: [
                    'PATCH /api/notificaciones/:id/leida',
                    'POST /api/notificaciones/reserva'
                ]
            },
            '/api/conversaciones': {
                description: 'Gestión de conversaciones',
                methods: ['GET', 'POST', 'DELETE'],
                especiales: [
                    'GET /api/conversaciones/buscar/entre-personas'
                ]
            },
            '/api/participantes-conversacion': {
                description: 'Gestión de participantes en conversaciones',
                methods: ['GET', 'POST', 'DELETE', 'PUT'],
                especiales: [
                    'GET /api/participantes-conversacion/buscar/comunes'
                ]
            },
            '/api/mensajes': {
                description: 'Gestión de mensajes',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                especiales: [
                    'POST /api/mensajes/enviar',
                    'GET /api/mensajes/buscar/texto'
                ]
            }
        }
    });
});

module.exports = router;
