const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config.js');

const HabitacionAmenity = sequelize.define('HabitacionAmenity', {
    habitacion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Habitaciones',
            key: 'id'
        }
    },
    amenity: {
        type: DataTypes.STRING(100),
        primaryKey: true
    }
}, {
    tableName: 'HabitacionAmenities',
    timestamps: false
});

module.exports = HabitacionAmenity;
