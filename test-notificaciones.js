// Script para probar las rutas de notificaciones
const axios = require('axios');

const baseURL = 'http://localhost:3002/api/v1';

async function probarRutasNotificaciones() {
    console.log('🔔 Probando rutas de notificaciones...\n');
    
    try {
        // Primero necesitamos una persona válida para las pruebas
        let idUsuarioTest = 1; // Usar el ID 1 que ya existe
        
        // 1. Probar POST - Crear nueva notificación
        console.log('1. ➕ Creando nueva notificación...');
        const nuevaNotificacion = {
            "id_usuario": idUsuarioTest.toString(),
            "tipo": "sistema",
            "estado": "sin leer",
            "titulo": "Notificación de prueba - Sistema actualizado",
            "fecha": new Date().toISOString()
        };
        
        try {
            const response = await axios.post(`${baseURL}/notificaciones`, nuevaNotificacion);
            console.log(`✅ Notificación creada con ID: ${response.data.id}`);
            const notificacionCreada = response.data;
            
            // 2. Probar GET por ID - Obtener notificación por ID
            console.log('\n2. 🔍 Obteniendo notificación por ID...');
            try {
                const notifResponse = await axios.get(`${baseURL}/notificaciones/${notificacionCreada.id}`);
                console.log(`✅ Notificación obtenida: "${notifResponse.data.titulo}"`);
                console.log(`   Estado: ${notifResponse.data.estado}`);
            } catch (error) {
                console.log('❌ Error obteniendo notificación por ID:', error.response?.data || error.message);
            }
            
            // 3. Probar GET por usuario - Obtener notificaciones de un usuario
            console.log('\n3. 👤 Obteniendo notificaciones del usuario...');
            try {
                const userNotifResponse = await axios.get(`${baseURL}/notificaciones/usuario/${idUsuarioTest}`);
                console.log(`✅ ${userNotifResponse.data.length} notificaciones encontradas para el usuario`);
                if (userNotifResponse.data.length > 0) {
                    console.log(`   Última: "${userNotifResponse.data[0].titulo}"`);
                }
            } catch (error) {
                console.log('❌ Error obteniendo notificaciones del usuario:', error.response?.data || error.message);
            }
            
            // 4. Probar PUT - Actualizar notificación (cambiar estado)
            console.log('\n4. ✏️ Actualizando estado de notificación...');
            const datosActualizacion = {
                "estado": "leído"
            };
            
            try {
                const updateResponse = await axios.put(`${baseURL}/notificaciones/${notificacionCreada.id}`, datosActualizacion);
                console.log('✅ Notificación actualizada exitosamente');
                console.log(`   Nuevo estado: ${updateResponse.data.estado}`);
            } catch (error) {
                console.log('❌ Error actualizando notificación:', error.response?.data || error.message);
            }
            
            // 5. Probar DELETE - Eliminar notificación
            console.log('\n5. ❌ Eliminando notificación de prueba...');
            try {
                const deleteResponse = await axios.delete(`${baseURL}/notificaciones/${notificacionCreada.id}`);
                console.log('✅ Notificación eliminada exitosamente');
                console.log(`   Mensaje: ${deleteResponse.data.mensaje}`);
            } catch (error) {
                console.log('❌ Error eliminando notificación:', error.response?.data || error.message);
            }
            
        } catch (error) {
            console.log('❌ Error creando notificación:', error.response?.data || error.message);
        }
        
        // 6. Probar error 404
        console.log('\n6. 🚫 Probando error 404...');
        try {
            await axios.get(`${baseURL}/notificaciones/999999`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Error 404 manejado correctamente');
            } else {
                console.log('❌ Error inesperado:', error.response?.data || error.message);
            }
        }
        
        // 7. Probar error de usuario no encontrado
        console.log('\n7. 🚫 Probando usuario no encontrado...');
        try {
            await axios.get(`${baseURL}/notificaciones/usuario/999999`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Error de usuario no encontrado manejado correctamente');
            } else {
                console.log('❌ Error inesperado:', error.response?.data || error.message);
            }
        }
        
        // 8. Probar datos inválidos en POST
        console.log('\n8. 🚫 Probando datos inválidos...');
        try {
            await axios.post(`${baseURL}/notificaciones`, {
                "titulo": "Sin campos requeridos"
            });
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Error 400 por datos inválidos manejado correctamente');
            } else {
                console.log('❌ Error inesperado:', error.response?.data || error.message);
            }
        }
        
        console.log('\n🎉 Pruebas de notificaciones completadas!');
        console.log('\n📋 Endpoints listos para Postman:');
        console.log(`   GET    ${baseURL}/notificaciones/{id}`);
        console.log(`   GET    ${baseURL}/notificaciones/usuario/{id_usuario}`);
        console.log(`   POST   ${baseURL}/notificaciones`);
        console.log(`   PUT    ${baseURL}/notificaciones/{id}`);
        console.log(`   DELETE ${baseURL}/notificaciones/{id}`);
        
        console.log('\n📝 Ejemplo de JSON para POST:');
        console.log(JSON.stringify({
            "id_usuario": "1",
            "tipo": "mensaje",
            "estado": "sin leer",
            "titulo": "Nueva tarea asignada",
            "fecha": "2025-06-30T14:45:00Z"
        }, null, 2));
        
        console.log('\n🔄 Ejemplo de JSON para PUT:');
        console.log(JSON.stringify({
            "estado": "leído"
        }, null, 2));
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    probarRutasNotificaciones();
}

module.exports = { probarRutasNotificaciones };
