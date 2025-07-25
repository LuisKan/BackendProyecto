require("dotenv").config(); 
const jwt = require('jsonwebtoken'); 
const { Persona } = require('../models/index');

module.exports.protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Se obtiene el token (p.ej., Bearer DJDHFHFHHFHFHF#%>%)
            token = req.headers.authorization;
            console.log('Token recibido con Bearer: ', token);
            
            // Se extrae solo el token sin la palabra "Bearer"
            token = token.split(' ')[1];
            console.log('Token extraído: ', token);
            
            // Se verifica el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado: ', decoded);
            
            // Se agrega a cada petición información de la persona - excepto la contraseña
            // (recuperado con base en el id contenido en el payload del token)
            req.persona = await Persona.findOne({
                where: { id: decoded.id },
                attributes: { exclude: ['contrasena'] }
            });
            
            if (!req.persona) {
                return res.status(401).json({ message: 'Persona no encontrada!' });
            }
            
            console.log('Persona autenticada: ', req.persona.primerNombre);
            next();
            
        } catch (error) {
            console.log('Error al verificar token: ', error.message);
            res.status(401).json({ message: 'Token no válido!' });
        }
    } else {
        // Si no se tiene un token de portador, entonces no estará autorizado
        res.status(401).json({ message: 'No autorizado, falta token!' });
    }
}

// Middleware adicional para verificar roles específicos
module.exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.persona) {
            return res.status(401).json({ message: 'Acceso denegado. No autenticado.' });
        }

        if (!roles.includes(req.persona.tipo)) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}` 
            });
        }

        next();
    };
};
