// Script para agregar datos de prueba
const axios = require('axios');

const baseURL = 'http://localhost:3002/api/v1';

// Habitaciones de prueba
const habitacionesPrueba = [
    {
        "id_habitacion": "HS303",
        "titulo": "Habitación Simple 303",
        "tipo": "Simple",
        "precio": "$1 - $300",
        "descripcion": "2 Plazas",
        "descripcionLarga": "Habitación cómoda ideal para una o dos personas. Cuenta con cama doble, baño privado, escritorio y excelente iluminación natural.",
        "camas": 1,
        "banos": 1,
        "parqueo": 1,
        "mascotas": 0,
        "precioDesglose": {
            "corto": "1",
            "medio": "20",
            "largo": "300"
        },
        "amenities": ["Wifi", "Alimentación", "Aire Acondicionado"],
        "portada": "/Habitaciones/HS303/HS303.webp"
    },
    {
        "id_habitacion": "HD105",
        "titulo": "Habitación Doble 105",
        "tipo": "Doble",
        "precio": "$1000 - $1800",
        "descripcion": "2 Plazas cómodas",
        "descripcionLarga": "Habitación doble con excelente ventilación y camas confortables.",
        "camas": 2,
        "banos": 1,
        "parqueo": 1,
        "mascotas": 1,
        "precioDesglose": {
            "corto": "1000",
            "medio": "1500",
            "largo": "1800"
        },
        "amenities": ["Wifi", "Smart TV", "Aire Acondicionado"],
        "portada": "/Habitaciones/HD105/HD105.webp"
    }
];

async function agregarDatosPrueba() {
    console.log('Agregando datos de prueba...');
    
    for (const habitacion of habitacionesPrueba) {
        try {
            const response = await axios.post(`${baseURL}/habitaciones`, habitacion);
            console.log(`✓ Habitación ${habitacion.id_habitacion} creada:`, response.data.id);
        } catch (error) {
            console.log(`❌ Error creando habitación ${habitacion.id_habitacion}:`, error.response?.data || error.message);
        }
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    agregarDatosPrueba();
}

module.exports = { agregarDatosPrueba };
