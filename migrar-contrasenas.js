require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Persona } = require('./serverMySQL/models');
const fs = require('fs');

async function migrarContrasenas() {
    try {
        // Crear backup de usuarios antes de la migración
        const usuarios = await Persona.findAll();
        const backup = {
            fecha: new Date().toISOString(),
            usuarios: usuarios.map(u => ({
                id: u.id,
                correo: u.correo,
                contrasena_original: u.contrasena
            }))
        };
        
        fs.writeFileSync('backup-usuarios.json', JSON.stringify(backup, null, 2));
        console.log('📄 Backup creado: backup-usuarios.json\n');
        
        console.log('=== MIGRACIÓN DE CONTRASEÑAS ===\n');
        console.log('Usuarios encontrados:');
        
        for (const usuario of usuarios) {
            console.log(`- ${usuario.primerNombre} (${usuario.correo}): "${usuario.contrasena}"`);
        }
        
        console.log('\n¿Quieres continuar con la migración? (y/n)');
        console.log('Esto hasheará todas las contraseñas en texto plano.\n');
        
        // Para propósitos de demostración, ejecutamos automáticamente
        for (const usuario of usuarios) {
            const yaEstaHasheada = usuario.contrasena.startsWith('$2a$') || usuario.contrasena.startsWith('$2b$');
            
            if (!yaEstaHasheada) {
                const salt = await bcrypt.genSalt(10);
                const contrasenaHasheada = await bcrypt.hash(usuario.contrasena, salt);
                
                await usuario.update({ contrasena: contrasenaHasheada });
                console.log(`✅ ${usuario.correo} - Migrado correctamente`);
            } else {
                console.log(`⚠️  ${usuario.correo} - Ya estaba hasheada`);
            }
        }
        
        console.log('\n🎉 ¡Migración completada!');
        console.log('📄 Backup guardado en: backup-usuarios.json');
        console.log('🔐 Todas las contraseñas están ahora hasheadas');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error.message);
        process.exit(1);
    }
}

migrarContrasenas();
