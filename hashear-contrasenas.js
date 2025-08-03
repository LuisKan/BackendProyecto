require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Persona } = require('./serverMySQL/models');

async function hashearContrasenas() {
    try {
        // Obtener todos los usuarios
        const usuarios = await Persona.findAll();
        
        console.log('=== HASHEANDO CONTRASEÑAS EXISTENTES ===\n');
        
        for (const usuario of usuarios) {
            // Verificar si ya está hasheada
            const yaEstaHasheada = usuario.contrasena.startsWith('$2a$') || usuario.contrasena.startsWith('$2b$');
            
            if (!yaEstaHasheada) {
                // Hashear la contraseña
                const salt = await bcrypt.genSalt(10);
                const contrasenaHasheada = await bcrypt.hash(usuario.contrasena, salt);
                
                // Actualizar en la base de datos
                await usuario.update({ contrasena: contrasenaHasheada });
                
                console.log(`✅ Usuario ${usuario.primerNombre} (${usuario.correo}) - Contraseña hasheada`);
            } else {
                console.log(`⚠️  Usuario ${usuario.primerNombre} (${usuario.correo}) - Ya estaba hasheada`);
            }
        }
        
        console.log('\n🎉 ¡Todas las contraseñas han sido hasheadas correctamente!');
        console.log('Ahora todos los usuarios pueden hacer login con sus contraseñas originales.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

hashearContrasenas();
