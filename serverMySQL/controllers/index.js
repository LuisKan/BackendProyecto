// Importar todos los controladores
const personaController = require('./persona.controller');
const habitacionController = require('./habitacion.controller');
const habitacionAmenityController = require('./habitacionAmenity.controller');
const reservaController = require('./reserva.controller');
const notificacionController = require('./notificacion.controller');
const conversacionController = require('./conversacion.controller');
const participanteConversacionController = require('./participanteConversacion.controller');
const mensajeController = require('./mensaje.controller');

module.exports = {
    personaController,
    habitacionController,
    habitacionAmenityController,
    reservaController,
    notificacionController,
    conversacionController,
    participanteConversacionController,
    mensajeController
};
