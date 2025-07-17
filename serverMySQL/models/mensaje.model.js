const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const Mensaje = sequelize.define('Mensaje', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    conversacion_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Conversaciones',
            key: 'id'
        }
    },
    emisor: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Personas',
            key: 'id'
        }
    },
    fecha: {
        type: DataTypes.DATE
    },
    texto: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'Mensajes',
    timestamps: false
});

module.exports = Mensaje;
