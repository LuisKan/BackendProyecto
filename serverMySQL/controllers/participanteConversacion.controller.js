const { ParticipanteConversacion, Conversacion, Persona } = require('../models');

const participanteConversacionController = {
    // Obtener todos los participantes de todas las conversaciones
    obtenerTodos: async (req, res) => {
        try {
            const participantes = await ParticipanteConversacion.findAll({
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'persona'
                    }
                ]
            });
            res.json(participantes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los participantes',
                detalle: error.message 
            });
        }
    },

    // Obtener participantes de una conversación específica
    obtenerPorConversacion: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            const participantes = await ParticipanteConversacion.findAll({
                where: { conversacion_id: conversacionId },
                include: [{
                    model: Persona,
                    as: 'persona'
                }]
            });
            
            res.json(participantes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener los participantes de la conversación',
                detalle: error.message 
            });
        }
    },

    // Obtener conversaciones de una persona específica
    obtenerPorPersona: async (req, res) => {
        try {
            const { personaId } = req.params;
            const participaciones = await ParticipanteConversacion.findAll({
                where: { persona_id: personaId },
                include: [{
                    model: Conversacion,
                    as: 'conversacion'
                }]
            });
            
            res.json(participaciones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener las conversaciones de la persona',
                detalle: error.message 
            });
        }
    },

    // Agregar participante a una conversación
    crear: async (req, res) => {
        try {
            const { conversacion_id, persona_id } = req.body;
            
            // Verificar si ya existe la participación
            const participanteExistente = await ParticipanteConversacion.findOne({
                where: { conversacion_id, persona_id }
            });
            
            if (participanteExistente) {
                return res.status(400).json({ 
                    error: 'La persona ya es participante de esta conversación' 
                });
            }
            
            const nuevoParticipante = await ParticipanteConversacion.create({
                conversacion_id,
                persona_id
            });
            
            // Obtener el participante completo con relaciones
            const participanteCompleto = await ParticipanteConversacion.findOne({
                where: { conversacion_id, persona_id },
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'persona'
                    }
                ]
            });
            
            res.status(201).json(participanteCompleto);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al agregar participante a la conversación',
                detalle: error.message 
            });
        }
    },

    // Eliminar participante de una conversación
    eliminar: async (req, res) => {
        try {
            const { conversacionId, personaId } = req.params;
            
            const filasAfectadas = await ParticipanteConversacion.destroy({
                where: { 
                    conversacion_id: conversacionId,
                    persona_id: personaId
                }
            });
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ 
                    error: 'La persona no es participante de esta conversación' 
                });
            }
            
            res.json({ mensaje: 'Participante eliminado de la conversación correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar participante de la conversación',
                detalle: error.message 
            });
        }
    },

    // Eliminar todos los participantes de una conversación
    eliminarTodosPorConversacion: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            
            const filasAfectadas = await ParticipanteConversacion.destroy({
                where: { conversacion_id: conversacionId }
            });
            
            res.json({ 
                mensaje: `${filasAfectadas} participantes eliminados de la conversación` 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar todos los participantes de la conversación',
                detalle: error.message 
            });
        }
    },

    // Eliminar persona de todas las conversaciones
    eliminarPersonaDeTodas: async (req, res) => {
        try {
            const { personaId } = req.params;
            
            const filasAfectadas = await ParticipanteConversacion.destroy({
                where: { persona_id: personaId }
            });
            
            res.json({ 
                mensaje: `Persona eliminada de ${filasAfectadas} conversaciones` 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar la persona de todas las conversaciones',
                detalle: error.message 
            });
        }
    },

    // Agregar múltiples participantes a una conversación
    agregarMultiples: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            const { participantes } = req.body;
            
            if (!participantes || !Array.isArray(participantes)) {
                return res.status(400).json({ 
                    error: 'Se requiere un array de IDs de participantes' 
                });
            }
            
            // Verificar participantes existentes
            const participantesExistentes = await ParticipanteConversacion.findAll({
                where: { 
                    conversacion_id: conversacionId,
                    persona_id: participantes
                }
            });
            
            const idsExistentes = participantesExistentes.map(p => p.persona_id);
            const participantesNuevos = participantes.filter(id => !idsExistentes.includes(id));
            
            if (participantesNuevos.length === 0) {
                return res.status(400).json({ 
                    error: 'Todos los participantes ya están en la conversación' 
                });
            }
            
            // Preparar datos para inserción
            const participantesData = participantesNuevos.map(personaId => ({
                conversacion_id: conversacionId,
                persona_id: personaId
            }));
            
            await ParticipanteConversacion.bulkCreate(participantesData);
            
            // Obtener todos los participantes actualizados
            const participantesActualizados = await ParticipanteConversacion.findAll({
                where: { conversacion_id: conversacionId },
                include: [{
                    model: Persona,
                    as: 'persona'
                }]
            });
            
            res.status(201).json({
                mensaje: `${participantesNuevos.length} nuevos participantes agregados`,
                participantesExistentes: idsExistentes.length,
                participantes: participantesActualizados
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al agregar múltiples participantes',
                detalle: error.message 
            });
        }
    },

    // Verificar si una persona es participante de una conversación
    verificarParticipacion: async (req, res) => {
        try {
            const { conversacionId, personaId } = req.params;
            
            const participante = await ParticipanteConversacion.findOne({
                where: { 
                    conversacion_id: conversacionId,
                    persona_id: personaId
                }
            });
            
            res.json({ 
                esParticipante: !!participante,
                participante: participante || null
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al verificar participación',
                detalle: error.message 
            });
        }
    },

    // Contar participantes por conversación
    contarPorConversacion: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            
            const count = await ParticipanteConversacion.count({
                where: { conversacion_id: conversacionId }
            });
            
            res.json({ 
                conversacionId: parseInt(conversacionId),
                totalParticipantes: count 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al contar participantes de la conversación',
                detalle: error.message 
            });
        }
    },

    // Contar conversaciones por persona
    contarPorPersona: async (req, res) => {
        try {
            const { personaId } = req.params;
            
            const count = await ParticipanteConversacion.count({
                where: { persona_id: personaId }
            });
            
            res.json({ 
                personaId: parseInt(personaId),
                totalConversaciones: count 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al contar conversaciones de la persona',
                detalle: error.message 
            });
        }
    },

    // Buscar conversaciones comunes entre dos personas
    buscarConversacionesComunes: async (req, res) => {
        try {
            const { persona1Id, persona2Id } = req.query;
            
            if (!persona1Id || !persona2Id) {
                return res.status(400).json({ 
                    error: 'Se requieren los IDs de ambas personas' 
                });
            }
            
            const { QueryTypes } = require('sequelize');
            const sequelize = require('../config/sequelize.config.js');
            
            // Buscar conversaciones donde ambas personas participen
            const conversacionesComunes = await sequelize.query(`
                SELECT c.id, COUNT(*) as total_participantes
                FROM Conversaciones c
                INNER JOIN ParticipantesConversacion pc1 ON c.id = pc1.conversacion_id AND pc1.persona_id = :persona1Id
                INNER JOIN ParticipantesConversacion pc2 ON c.id = pc2.conversacion_id AND pc2.persona_id = :persona2Id
                GROUP BY c.id
            `, {
                replacements: { persona1Id, persona2Id },
                type: QueryTypes.SELECT
            });
            
            res.json(conversacionesComunes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al buscar conversaciones comunes',
                detalle: error.message 
            });
        }
    },

    // Reemplazar todos los participantes de una conversación
    reemplazarTodos: async (req, res) => {
        try {
            const { conversacionId } = req.params;
            const { participantes } = req.body;
            
            if (!participantes || !Array.isArray(participantes)) {
                return res.status(400).json({ 
                    error: 'Se requiere un array de IDs de participantes' 
                });
            }
            
            if (participantes.length < 2) {
                return res.status(400).json({ 
                    error: 'Una conversación debe tener al menos 2 participantes' 
                });
            }
            
            // Eliminar participantes existentes
            await ParticipanteConversacion.destroy({
                where: { conversacion_id: conversacionId }
            });
            
            // Agregar nuevos participantes
            const participantesData = participantes.map(personaId => ({
                conversacion_id: conversacionId,
                persona_id: personaId
            }));
            
            await ParticipanteConversacion.bulkCreate(participantesData);
            
            // Obtener participantes actualizados
            const participantesActualizados = await ParticipanteConversacion.findAll({
                where: { conversacion_id: conversacionId },
                include: [
                    {
                        model: Conversacion,
                        as: 'conversacion'
                    },
                    {
                        model: Persona,
                        as: 'persona'
                    }
                ]
            });
            
            res.json({
                mensaje: 'Participantes reemplazados correctamente',
                participantes: participantesActualizados
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al reemplazar participantes',
                detalle: error.message 
            });
        }
    }
};

module.exports = participanteConversacionController;
