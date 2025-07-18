# 🚀 API de Conversaciones - Backend Hostel

## ✅ **Rutas Implementadas**

### 📋 **Base URL**: `http://localhost:3002/api/v1`

---

## 🔄 **Endpoints de Conversaciones**

### 1. 📄 **GET /conversaciones**
**Obtener todas las conversaciones**

```bash
GET http://localhost:3002/api/v1/conversaciones
```

**Respuesta:**
```json
[
  {
    "id": "conv1",
    "participantes": ["1", "2"],
    "mensajes": [
      {
        "id": 1,
        "emisor": "1",
        "fecha": "2025-07-17T10:30:00.000Z",
        "texto": "Hola, ¿cómo estás?"
      }
    ]
  }
]
```

---

### 2. 📄 **GET /conversaciones/:id**
**Obtener conversación por ID**

```bash
GET http://localhost:3002/api/v1/conversaciones/conv1
```

**Respuesta:**
```json
{
  "id": "conv1",
  "participantes": ["1", "2"],
  "mensajes": [
    {
      "id": 1,
      "emisor": "1",
      "fecha": "2025-07-17T10:30:00.000Z",
      "texto": "Hola, ¿cómo estás?"
    }
  ]
}
```

---

### 3. ➕ **POST /conversaciones**
**Crear nueva conversación**

```bash
POST http://localhost:3002/api/v1/conversaciones
Content-Type: application/json

{
  "participantes": ["1", "2"]
}
```

**Respuesta (201):**
```json
{
  "id": "conv5",
  "participantes": ["1", "2"],
  "mensajes": []
}
```

---

### 4. ➕ **POST /conversaciones/:id/mensajes**
**Enviar mensaje a conversación**

```bash
POST http://localhost:3002/api/v1/conversaciones/conv5/mensajes
Content-Type: application/json

{
  "emisor": "1",
  "texto": "Hola, ¿nos reunimos mañana?"
}
```

**Respuesta (201):**
```json
{
  "mensaje": "Mensaje agregado correctamente",
  "mensajeEnviado": {
    "id": "msg-1752814790890",
    "emisor": "1",
    "texto": "Hola, ¿nos reunimos mañana?",
    "fecha": "2025-07-17T10:30:00.000Z"
  }
}
```

---

### 5. ✏️ **PUT /conversaciones/:idConversacion/mensajes/:idMensaje**
**Editar mensaje**

```bash
PUT http://localhost:3002/api/v1/conversaciones/conv5/mensajes/1
Content-Type: application/json

{
  "texto": "Mejor nos reunimos el jueves a las 10"
}
```

**Respuesta (200):**
```json
{
  "mensaje": {
    "id": 1,
    "emisor": "1",
    "fecha": "2025-07-17T10:30:00.000Z",
    "texto": "Mejor nos reunimos el jueves a las 10"
  }
}
```

---

### 6. ❌ **DELETE /conversaciones/:id**
**Eliminar conversación**

```bash
DELETE http://localhost:3002/api/v1/conversaciones/conv5
```

**Respuesta (200):**
```json
{
  "mensaje": "Conversación eliminada correctamente"
}
```

---

### 7. ❌ **DELETE /conversaciones/:id/mensajes/:mensajeId**
**Eliminar mensaje**

```bash
DELETE http://localhost:3002/api/v1/conversaciones/conv5/mensajes/1
```

**Respuesta (200):**
```json
{
  "mensaje": "Mensaje eliminado correctamente"
}
```

---

## 🔧 **Ejemplos de Uso con cURL**

```bash
# Obtener todas las conversaciones
curl -X GET http://localhost:3002/api/v1/conversaciones

# Crear nueva conversación
curl -X POST http://localhost:3002/api/v1/conversaciones \
  -H "Content-Type: application/json" \
  -d '{"participantes": ["1", "2"]}'

# Enviar mensaje
curl -X POST http://localhost:3002/api/v1/conversaciones/conv5/mensajes \
  -H "Content-Type: application/json" \
  -d '{"emisor": "1", "texto": "¿Nos reunimos mañana?"}'
```

---

## ⚠️ **Errores Posibles**

### 404 - Conversación no encontrada
```json
{
  "error": "Conversación no encontrada"
}
```

### 400 - Validación fallida
```json
{
  "error": "Se requieren exactamente dos participantes para crear una conversación"
}
```

### 400 - Participantes iguales
```json
{
  "error": "Los participantes deben ser diferentes"
}
```

---

## 🎯 **Compatibilidad con Frontend**

✅ **Puerto**: 3002 (ajustado desde 8000)  
✅ **Versionado**: `/api/v1`  
✅ **Formato de IDs**: `conv{número}` para conversaciones  
✅ **Participantes**: Array de strings  
✅ **Mensajes**: Formato exacto según Postman  
✅ **Códigos de estado**: 200, 201, 400, 404, 500  

---

## 🧪 **Datos de Prueba**

Ejecuta el script para crear datos de prueba:
```bash
node test-conversaciones.js
```

Esto creará:
- 2 conversaciones con participantes existentes
- Mensajes de ejemplo en las conversaciones
- IDs listos para probar en Postman

---

## 🎉 **¡Todo Listo!**

Tu backend está 100% compatible con las rutas definidas en tu Postman. Solo cambia el puerto de 8000 a 3002 en tus requests y todo funcionará perfectamente.
