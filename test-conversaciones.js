// Script para agregar datos de prueba para conversaciones
const axios = require('axios');

const baseURL = 'http://localhost:3002/api/v1';

// Datos de prueba
const personasPrueba = [
    {
        "primerNombre": "Luis",
        "primerApellido": "García",
        "correo": "luis@example.com",
        "contrasena": "123456",
        "tipo": "usuario"
    },
    {
        "primerNombre": "Kevin",
        "primerApellido": "Pérez",
        "correo": "kevin@example.com", 
        "contrasena": "123456",
        "tipo": "usuario"
    },
    {
        "primerNombre": "Ana",
        "primerApellido": "López",
        "correo": "ana@example.com",
        "contrasena": "123456", 
        "tipo": "usuario"
    },
    {
        "primerNombre": "Carlos",
        "primerApellido": "Rodríguez",
        "correo": "carlos@example.com",
        "contrasena": "123456",
        "tipo": "usuario"
    }
];

async function agregarDatosConversaciones() {
    console.log('Agregando datos de prueba para conversaciones...');
    
    try {
        // 1. Crear personas primero (o usar las existentes)
        console.log('1. Obteniendo personas existentes...');
        
        try {
            const personasResponse = await axios.get(`${baseURL}/personas`);
            const personasExistentes = personasResponse.data;
            
            if (personasExistentes.length >= 2) {
                console.log(`✓ Usando ${personasExistentes.length} personas existentes`);
                
                // 2. Crear conversaciones
                console.log('\\n2. Creando conversaciones...');
                
                const conversacion1 = {
                    "participantes": [
                        personasExistentes[0].id.toString(),
                        personasExistentes[1].id.toString()
                    ]
                };
                
                let conversacion2 = null;
                if (personasExistentes.length >= 4) {
                    conversacion2 = {
                        "participantes": [
                            personasExistentes[2].id.toString(),
                            personasExistentes[3].id.toString()
                        ]
                    };
                }
                
                const conversacionesCreadas = [];
                const conversacionesParaCrear = conversacion2 ? [conversacion1, conversacion2] : [conversacion1];
                
                for (const conv of conversacionesParaCrear) {
                    try {
                        const response = await axios.post(`${baseURL}/conversaciones`, conv);
                        conversacionesCreadas.push(response.data);
                        console.log(`✓ Conversación creada:`, response.data.id);
                    } catch (error) {
                        console.log(`❌ Error creando conversación:`, error.response?.data || error.message);
                    }
                }
                
                // 3. Agregar mensajes a las conversaciones
                console.log('\\n3. Agregando mensajes...');
                
                if (conversacionesCreadas.length > 0) {
                    const mensajes = [
                        {
                            conversacionId: conversacionesCreadas[0].id,
                            mensaje: {
                                "emisor": personasExistentes[0].id.toString(),
                                "texto": "Hola, ¿cómo estás?"
                            }
                        },
                        {
                            conversacionId: conversacionesCreadas[0].id,
                            mensaje: {
                                "emisor": personasExistentes[1].id.toString(),
                                "texto": "Hola, todo bien. ¿Y tú?"
                            }
                        }
                    ];
                    
                    for (const msg of mensajes) {
                        try {
                            const response = await axios.post(
                                `${baseURL}/conversaciones/${msg.conversacionId}/mensajes`, 
                                msg.mensaje
                            );
                            console.log(`✓ Mensaje agregado:`, response.data.mensajeEnviado?.texto);
                        } catch (error) {
                            console.log(`❌ Error agregando mensaje:`, error.response?.data || error.message);
                        }
                    }
                }
                
                console.log('\\n🎉 Datos de prueba creados exitosamente!');
                console.log('\\nPuedes probar los endpoints:');
                console.log(`- GET ${baseURL}/conversaciones`);
                if (conversacionesCreadas[0]) {
                    console.log(`- GET ${baseURL}/conversaciones/${conversacionesCreadas[0].id}`);
                    console.log(`- POST ${baseURL}/conversaciones/${conversacionesCreadas[0].id}/mensajes`);
                }
                
            } else {
                console.log('❌ No hay suficientes personas en la base de datos');
            }
            
        } catch (error) {
            console.log('❌ Error obteniendo personas:', error.response?.data || error.message);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    agregarDatosConversaciones();
}

module.exports = { agregarDatosConversaciones };
