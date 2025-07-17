const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Personas',
            key: 'id'
        }
    },
    texto: {
        type: DataTypes.TEXT
    },
    fecha: {
        type: DataTypes.DATEONLY
    },
    tipo: {
        type: DataTypes.STRING(20) // nueva, aceptada, rechazada, etc.
    }
}, {
    tableName: 'Notificaciones',
    timestamps: false
});

module.exports = Notificacion;
