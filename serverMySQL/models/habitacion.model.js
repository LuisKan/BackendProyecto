const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const Habitacion = sequelize.define('Habitacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_habitacion: {
        type: DataTypes.STRING(20)
    },
    titulo: {
        type: DataTypes.STRING(100)
    },
    tipo: {
        type: DataTypes.STRING(50)
    },
    precio: {
        type: DataTypes.STRING(50)
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    descripcionLarga: {
        type: DataTypes.TEXT
    },
    camas: {
        type: DataTypes.INTEGER
    },
    banos: {
        type: DataTypes.INTEGER
    },
    parqueo: {
        type: DataTypes.INTEGER
    },
    mascotas: {
        type: DataTypes.BOOLEAN
    },
    portada: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'Habitaciones',
    timestamps: false
});

module.exports = Habitacion;
