const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const Reserva = sequelize.define('Reserva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    habitacionId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Habitaciones',
            key: 'id'
        }
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Personas',
            key: 'id'
        }
    },
    usuarioNombre: {
        type: DataTypes.STRING(100)
    },
    correo: {
        type: DataTypes.STRING(100)
    },
    checkIn: {
        type: DataTypes.DATEONLY
    },
    checkOut: {
        type: DataTypes.DATEONLY
    },
    adultos: {
        type: DataTypes.INTEGER
    },
    ninos: {
        type: DataTypes.INTEGER
    },
    personas: {
        type: DataTypes.STRING(50)
    },
    precio: {
        type: DataTypes.STRING(20)
    },
    estado: {
        type: DataTypes.STRING(20) // aceptada, rechazada, confirmada
    },
    fechaCreacion: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'Reservas',
    timestamps: false
});

module.exports = Reserva;
