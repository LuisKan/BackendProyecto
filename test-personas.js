// Script para probar las rutas de personas
const axios = require('axios');

const baseURL = 'http://localhost:3002/api/v1';

async function probarRutasPersonas() {
    console.log('🧪 Probando rutas de personas...\n');
    
    try {
        // 1. Probar GET de personas existentes
        console.log('1. 📄 Obteniendo personas existentes...');
        try {
            const response = await axios.get(`${baseURL}/personas`);
            console.log(`✅ ${response.data.length} personas encontradas`);
            
            if (response.data.length > 0) {
                console.log(`   Ejemplo: ${response.data[0].primerNombre} (ID: ${response.data[0].id})`);
                
                // Probar GET por ID con la primera persona
                console.log('\n2. 🔍 Obteniendo persona por ID...');
                try {
                    const personaResponse = await axios.get(`${baseURL}/personas/${response.data[0].id}`);
                    console.log(`✅ Persona obtenida: ${personaResponse.data.primerNombre} ${personaResponse.data.primerApellido}`);
                } catch (error) {
                    console.log('❌ Error obteniendo persona por ID:', error.response?.data || error.message);
                }
            }
            
        } catch (error) {
            console.log('❌ Error obteniendo personas:', error.response?.data || error.message);
        }
        
        // 3. Probar POST - Crear nueva persona
        console.log('\n3. ➕ Creando nueva persona...');
        const nuevaPersona = {
            "primerNombre": "Test",
            "segundoNombre": "Usuario",
            "primerApellido": "Prueba",
            "prefijo": "+593",
            "numero": "+593999888777",
            "correo": `test${Date.now()}@example.com`,
            "contrasena": "123456",
            "tipo": "usuario",
            "foto": ""
        };
        
        try {
            const response = await axios.post(`${baseURL}/personas`, nuevaPersona);
            console.log(`✅ Persona creada con ID: ${response.data.id}`);
            const personaCreada = response.data;
            
            // 4. Probar PUT - Actualizar persona
            console.log('\n4. ✏️ Actualizando persona...');
            const datosActualizados = {
                "primerNombre": "TestActualizado",
                "segundoNombre": "UsuarioNuevo", 
                "primerApellido": "PruebaModificada",
                "prefijo": "+593",
                "numero": "+593999888777",
                "correo": personaCreada.correo, // Mantener el mismo correo
                "contrasena": "newpass123",
                "tipo": "admin",
                "foto": "foto_actualizada.jpg"
            };
            
            try {
                const updateResponse = await axios.put(`${baseURL}/personas/${personaCreada.id}`, datosActualizados);
                console.log('✅ Persona actualizada exitosamente');
                console.log(`   Nuevo nombre: ${updateResponse.data.personas[0].primerNombre}`);
            } catch (error) {
                console.log('❌ Error actualizando persona:', error.response?.data || error.message);
            }
            
            // 5. Probar DELETE - Eliminar persona
            console.log('\n5. ❌ Eliminando persona de prueba...');
            try {
                const deleteResponse = await axios.delete(`${baseURL}/personas/${personaCreada.id}`);
                console.log('✅ Persona eliminada exitosamente');
                console.log(`   Mensaje: ${deleteResponse.data.mensaje}`);
            } catch (error) {
                console.log('❌ Error eliminando persona:', error.response?.data || error.message);
            }
            
        } catch (error) {
            console.log('❌ Error creando persona:', error.response?.data || error.message);
        }
        
        // 6. Probar error 404
        console.log('\n6. 🚫 Probando error 404...');
        try {
            await axios.get(`${baseURL}/personas/999999`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Error 404 manejado correctamente');
            } else {
                console.log('❌ Error inesperado:', error.response?.data || error.message);
            }
        }
        
        console.log('\n🎉 Pruebas completadas!');
        console.log('\n📋 Endpoints listos para Postman:');
        console.log(`   GET    ${baseURL}/personas`);
        console.log(`   GET    ${baseURL}/personas/{id}`);
        console.log(`   POST   ${baseURL}/personas`);
        console.log(`   PUT    ${baseURL}/personas/{id}`);
        console.log(`   DELETE ${baseURL}/personas/{id}`);
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    probarRutasPersonas();
}

module.exports = { probarRutasPersonas };
