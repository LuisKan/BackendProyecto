const sequelize = require('../config/sequelize.config.js');

// Importar todos los modelos
const Persona = require('./persona.model.js');
const Habitacion = require('./habitacion.model.js');
const HabitacionAmenity = require('./habitacionAmenity.model.js');
const Reserva = require('./reserva.model.js');
const Notificacion = require('./notificacion.model.js');
const Conversacion = require('./conversacion.model.js');
const ParticipanteConversacion = require('./participanteConversacion.model.js');
const Mensaje = require('./mensaje.model.js');

// Definir relaciones entre modelos

// Habitacion - HabitacionAmenity (1:N)
Habitacion.hasMany(HabitacionAmenity, { foreignKey: 'habitacion_id', as: 'amenities' });
HabitacionAmenity.belongsTo(Habitacion, { foreignKey: 'habitacion_id', as: 'habitacion' });

// Persona - Reserva (1:N)
Persona.hasMany(Reserva, { foreignKey: 'usuarioId', as: 'reservas' });
Reserva.belongsTo(Persona, { foreignKey: 'usuarioId', as: 'usuario' });

// Habitacion - Reserva (1:N)
Habitacion.hasMany(Reserva, { foreignKey: 'habitacionId', as: 'reservas' });
Reserva.belongsTo(Habitacion, { foreignKey: 'habitacionId', as: 'habitacion' });

// Persona - Notificacion (1:N)
Persona.hasMany(Notificacion, { foreignKey: 'usuarioId', as: 'notificaciones' });
Notificacion.belongsTo(Persona, { foreignKey: 'usuarioId', as: 'usuario' });

// Conversacion - ParticipanteConversacion (1:N)
Conversacion.hasMany(ParticipanteConversacion, { foreignKey: 'conversacion_id', as: 'participantes' });
ParticipanteConversacion.belongsTo(Conversacion, { foreignKey: 'conversacion_id', as: 'conversacion' });

// Persona - ParticipanteConversacion (1:N)
Persona.hasMany(ParticipanteConversacion, { foreignKey: 'persona_id', as: 'conversaciones' });
ParticipanteConversacion.belongsTo(Persona, { foreignKey: 'persona_id', as: 'persona' });

// Conversacion - Mensaje (1:N)
Conversacion.hasMany(Mensaje, { foreignKey: 'conversacion_id', as: 'mensajes' });
Mensaje.belongsTo(Conversacion, { foreignKey: 'conversacion_id', as: 'conversacion' });

// Persona - Mensaje (1:N)
Persona.hasMany(Mensaje, { foreignKey: 'emisor', as: 'mensajesEnviados' });
Mensaje.belongsTo(Persona, { foreignKey: 'emisor', as: 'personaEmisor' });

// Relación many-to-many entre Persona y Conversacion a través de ParticipanteConversacion
Persona.belongsToMany(Conversacion, {
    through: ParticipanteConversacion,
    foreignKey: 'persona_id',
    otherKey: 'conversacion_id',
    as: 'conversacionesParticipadas'
});

Conversacion.belongsToMany(Persona, {
    through: ParticipanteConversacion,
    foreignKey: 'conversacion_id',
    otherKey: 'persona_id',
    as: 'personas'
});

module.exports = {
    sequelize,
    Persona,
    Habitacion,
    HabitacionAmenity,
    Reserva,
    Notificacion,
    Conversacion,
    ParticipanteConversacion,
    Mensaje
};
