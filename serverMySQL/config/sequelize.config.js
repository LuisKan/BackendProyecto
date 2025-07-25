// Cargar variables de entorno
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Usar variables de entorno en lugar de valores hardcodeados
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'admin';
const bdd_name = process.env.DB_NAME || 'hosteldb';
const hostName = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 3306;

console.log('Configuración de BD:', {
    host: hostName,
    user: username,
    database: bdd_name,
    port: port
});

const initialSequelize = new Sequelize('', username, password, {
    host: hostName,
    port: port,
    dialect: 'mysql'
});

const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    port: port,
    dialect: 'mysql'
});

async function setupDatabase() {
    try {
        await initialSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${bdd_name}\`;`);
        console.log('BDD creada o ya existía');

        await sequelize.authenticate();
        console.log('Conexión establecida con la BDD');

        await sequelize.sync(); // Sincroniza modelos (si ya los tienes definidos)
        console.log('Base de datos sincronizada');
    } catch (error) {
        console.error('Error en la configuración de la BDD:', error);
        process.exit(1);
    }
}

setupDatabase();

module.exports = sequelize;
