require('dotenv').config();
const { Persona } = require('./serverMySQL/models');

async function verificarUsuarios() {
    try {
        const usuarios = await Persona.findAll({
            attributes: ['id', 'primerNombre', 'correo', 'contrasena']
        });
        
        console.log('=== USUARIOS EN LA BASE DE DATOS ===\n');
        
        usuarios.forEach(usuario => {
            const esHasheada = usuario.contrasena.startsWith('$2a$') || usuario.contrasena.startsWith('$2b$');
            console.log(`ID: ${usuario.id}`);
            console.log(`Nombre: ${usuario.primerNombre}`);
            console.log(`Correo: ${usuario.correo}`);
            console.log(`Contraseña: ${usuario.contrasena.substring(0, 20)}...`);
            console.log(`¿Está hasheada?: ${esHasheada ? 'SÍ' : 'NO'}`);
            console.log('---');
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

verificarUsuarios();
