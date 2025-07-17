const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

// Importar la configuración de Sequelize para inicializar la conexión a la base de datos
require('./serverMySQL/config/sequelize.config');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar las rutas principales
const apiRoutes = require('./serverMySQL/routes');

// Usar las rutas con el prefijo /api
app.use('/api', apiRoutes);

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({
        message: 'HostelDB API Server',
        status: 'OK',
        version: '1.0.0',
        endpoints: {
            status: '/api/status',
            docs: '/api/docs',
            personas: '/api/personas',
            habitaciones: '/api/habitaciones',
            reservas: '/api/reservas',
            notificaciones: '/api/notificaciones',
            conversaciones: '/api/conversaciones',
            mensajes: '/api/mensajes'
        }
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        message: 'La ruta solicitada no existe',
        availableEndpoints: '/api/docs'
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error:', error.message);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message
    });
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`HostelDB Server listening at port ${port}`);
    console.log(`API Documentation: http://localhost:${port}/api/docs`);
    console.log(`API Status: http://localhost:${port}/api/status`);
});
