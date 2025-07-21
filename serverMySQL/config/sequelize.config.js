const { Sequelize } = require('sequelize');

const username = 'root';
const password = 'oscar';
const bdd_name = 'HostelDB';
const hostName = 'localhost';

const initialSequelize = new Sequelize('', username, password, {
    host: hostName,
    dialect: 'mysql'
});

const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
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
