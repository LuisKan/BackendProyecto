const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; 

const dbPath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Funciones utilitarias
function leerDB() {
    const raw = fs.readFileSync(dbPath);
    return JSON.parse(raw);
}

function guardarDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Endpoints para personas
app.get('/api/personas', (req, res) => {
    const data = leerDB();
    res.json(data.personas);
});

app.get('/api/personas/:id', (req, res) => {
    const id = req.params.id;
    const data = leerDB();
    const persona = data.personas.find(p => p.id === id);
    if (persona) {
        res.json(persona);
    } else {
        res.status(404).json({ error: 'Persona no encontrada' });
    }
});

app.post('/api/personas', (req, res) => {
    const data = leerDB();
    const nuevaPersona = {
        id: Date.now().toString(),
        ...req.body
    };
    data.personas.push(nuevaPersona);
    guardarDB(data);
    res.status(201).json(nuevaPersona);
});

app.put('/api/personas/:id', (req, res) => {
    const id = req.params.id;
    const data = leerDB();
    const index = data.personas.findIndex(p => p.id === id);

    if (index !== -1) {
        data.personas[index] = { ...data.personas[index], ...req.body };
        guardarDB(data);
        res.json(data.personas[index]);
    } else {
        res.status(404).json({ error: 'Persona no encontrada' });
    }
});

app.delete('/api/personas/:id', (req, res) => {
    const id = req.params.id;
    const data = leerDB();
    const index = data.personas.findIndex(p => p.id === id);

    if (index !== -1) {
        const eliminado = data.personas.splice(index, 1)[0];
        guardarDB(data);
        res.json({ mensaje: 'Persona eliminada', persona: eliminado });
    } else {
        res.status(404).json({ error: 'Persona no encontrada' });
    }
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
