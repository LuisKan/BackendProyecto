const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const Conversacion = sequelize.define('Conversacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'Conversaciones',
    timestamps: false
});

module.exports = Conversacion;
