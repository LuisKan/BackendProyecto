const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const ParticipanteConversacion = sequelize.define('ParticipanteConversacion', {
    conversacion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Conversaciones',
            key: 'id'
        }
    },
    persona_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Personas',
            key: 'id'
        }
    }
}, {
    tableName: 'ParticipantesConversacion',
    timestamps: false
});

module.exports = ParticipanteConversacion;
