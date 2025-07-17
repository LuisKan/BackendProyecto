const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const Persona = sequelize.define('Persona', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    primerNombre: DataTypes.STRING,
    segundoNombre: DataTypes.STRING,
    primerApellido: DataTypes.STRING,
    prefijo: DataTypes.STRING,
    numero: DataTypes.STRING,
    correo: {
        type: DataTypes.STRING,
        unique: true
    },
    contrasena: DataTypes.STRING,
    tipo: DataTypes.STRING,
    foto: DataTypes.TEXT
}, {
    tableName: 'Personas',
    timestamps: false
});

module.exports = Persona;
