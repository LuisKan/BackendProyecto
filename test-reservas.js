// Script para probar las rutas de reservas
const axios = require('axios');

const baseURL = 'http://localhost:3002/api/v1';

async function probarRutasReservas() {
    console.log('🏨 Probando rutas de reservas...\n');
    
    try {
        // 1. Probar POST - Crear nueva reserva
        console.log('1. ➕ Creando nueva reserva...');
        const nuevaReserva = {
            "habitacionId": "2",
            "usuarioId": "1",
            "usuarioNombre": "Luis Joaquin Guerrero",
            "correo": "ejemplo@hostel.com",
            "checkIn": "2025-07-01",
            "checkOut": "2025-07-05",
            "adultos": 2,
            "ninos": 1,
            "precio": "$2500"
        };
        
        try {
            const response = await axios.post(`${baseURL}/reservas`, nuevaReserva);
            console.log(`✅ Reserva creada con ID: ${response.data.id}`);
            console.log(`   Mensaje: ${response.data.mensaje}`);
            const reservaCreada = response.data;
            
            // 2. Probar GET - Obtener todas las reservas
            console.log('\n2. 📄 Obteniendo todas las reservas...');
            try {
                const reservasResponse = await axios.get(`${baseURL}/reservas/mis-reservas`);
                console.log(`✅ ${reservasResponse.data.reservas.length} reservas encontradas`);
                if (reservasResponse.data.reservas.length > 0) {
                    const primeraReserva = reservasResponse.data.reservas[0];
                    console.log(`   Ejemplo: ${primeraReserva.usuarioNombre} - ${primeraReserva.tituloHabitacion}`);
                    console.log(`   Estado: ${primeraReserva.estado}`);
                    
                    // 3. Probar PUT - Actualizar reserva
                    console.log('\n3. ✏️ Actualizando reserva...');
                    const datosActualizacion = {
                        "checkIn": "2025-07-02",
                        "checkOut": "2025-07-06",
                        "estado": "modificada"
                    };
                    
                    try {
                        const updateResponse = await axios.put(`${baseURL}/reservas/${reservaCreada.id}`, datosActualizacion);
                        console.log('✅ Reserva actualizada exitosamente');
                        console.log(`   Mensaje: ${updateResponse.data.mensaje}`);
                    } catch (error) {
                        console.log('❌ Error actualizando reserva:', error.response?.data || error.message);
                    }
                    
                    // 4. Probar DELETE - Eliminar reserva
                    console.log('\n4. ❌ Eliminando reserva de prueba...');
                    try {
                        const deleteResponse = await axios.delete(`${baseURL}/reservas/mis-reservas/${reservaCreada.id}`);
                        console.log('✅ Reserva eliminada exitosamente');
                        console.log(`   Mensaje: ${deleteResponse.data.mensaje}`);
                    } catch (error) {
                        console.log('❌ Error eliminando reserva:', error.response?.data || error.message);
                    }
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log('✅ Error 404 manejado correctamente (no hay reservas)');
                } else {
                    console.log('❌ Error obteniendo reservas:', error.response?.data || error.message);
                }
            }
            
        } catch (error) {
            console.log('❌ Error creando reserva:', error.response?.data || error.message);
        }
        
        // 5. Probar errores de validación en POST
        console.log('\n5. 🚫 Probando datos inválidos en POST...');
        try {
            await axios.post(`${baseURL}/reservas`, {
                "usuarioNombre": "Sin habitacionId",
                "correo": "test@example.com"
            });
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Error 400 por campo obligatorio manejado correctamente');
                console.log(`   Error: ${error.response.data.error}`);
            } else {
                console.log('❌ Error inesperado:', error.response?.data || error.message);
            }
        }
        
        // 6. Probar error 403 en PUT (reserva no encontrada)
        console.log('\n6. 🚫 Probando actualización de reserva inexistente...');
        try {
            await axios.put(`${baseURL}/reservas/999999`, {
                "checkIn": "2025-07-02",
                "checkOut": "2025-07-06",
                "estado": "modificada"
            });
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('✅ Error 403 (Acceso denegado) manejado correctamente');
            } else {
                console.log('❌ Error inesperado:', error.response?.data || error.message);
            }
        }
        
        // 7. Probar error 404 en DELETE
        console.log('\n7. 🚫 Probando eliminación de reserva inexistente...');
        try {
            await axios.delete(`${baseURL}/reservas/mis-reservas/999999`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Error 404 (Reserva no encontrada) manejado correctamente');
            } else {
                console.log('❌ Error inesperado:', error.response?.data || error.message);
            }
        }
        
        console.log('\n🎉 Pruebas de reservas completadas!');
        console.log('\n📋 Endpoints listos para Postman:');
        console.log(`   GET    ${baseURL}/reservas/mis-reservas`);
        console.log(`   POST   ${baseURL}/reservas`);
        console.log(`   PUT    ${baseURL}/reservas/{id}`);
        console.log(`   DELETE ${baseURL}/reservas/mis-reservas/{id}`);
        
        console.log('\n📝 Ejemplo de JSON para POST (Crear reserva):');
        console.log(JSON.stringify({
            "habitacionId": "2",
            "usuarioId": "1",
            "usuarioNombre": "Luis Joaquin Guerrero",
            "correo": "ejemplo@hostel.com",
            "checkIn": "2025-07-01",
            "checkOut": "2025-07-05",
            "adultos": 2,
            "ninos": 1,
            "precio": "$2500"
        }, null, 2));
        
        console.log('\n🔄 Ejemplo de JSON para PUT (Actualizar reserva):');
        console.log(JSON.stringify({
            "checkIn": "2025-07-02",
            "checkOut": "2025-07-06",
            "estado": "modificada"
        }, null, 2));
        
        console.log('\n📊 Formato de respuesta GET:');
        console.log(`{
  "reservas": [
    {
      "id": "1750645838922",
      "habitacionId": "2",
      "tituloHabitacion": "Habitación Delux 302",
      "imagen": "/Habitaciones/HDE302/HDE302.webp",
      "usuarioId": "1",
      "usuarioNombre": "Luis Joaquin Guerrero",
      "correo": "ejemplo@hostel.com",
      "checkIn": "2025-06-23",
      "checkOut": "2025-06-24",
      "adultos": 1,
      "ninos": 0,
      "personas": "1 Adulto(s), 0 Niño(s)",
      "precio": "$1200",
      "estado": "aceptada",
      "fechaCreacion": "2025-06-23T02:30:38.922Z"
    }
  ]
}`);
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    probarRutasReservas();
}

module.exports = { probarRutasReservas };
