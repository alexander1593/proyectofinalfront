import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

import pool from './db.js'

dotenv.config()

const app = express()

// Toma el puerto asignado por el entorno (Render, Heroku, etc.) o el 3001 por defecto
const PORT = process.env.PORT || 3001


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors())
app.use(express.json())


// =========================================
// RUTA DE PRUEBA
// =========================================

app.get('/api', (req, res) => {
    res.json({
        mensaje: 'Servidor 444 ESSENCE funcionando de forma segura'
    })
})


// =========================================
// LOGIN (Versión Segura)
// =========================================

app.post('/api/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // 1. Validar entradas requeridas
        if (!usuario || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Debes ingresar usuario y contraseña.'
            });
        }

        // 2. Consulta SQL con marcadores de posición (?)
        // Los datos del usuario no se concatenan en el string SQL,
        // evitando que cualquier entrada sea ejecutada como código.
        const query = 'SELECT id, usuario, password, nombre FROM usuarios WHERE usuario = ?';
        
        const [rows] = await pool.query(query, [usuario]);

        // 3. Verificar si el usuario existe
        if (rows.length === 0) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        const usuarioEncontrado = rows[0];

        // 4. Comparar la contraseña ingresada con el hash almacenado en la BD
        const esPasswordValida = await bcrypt.compare(password, usuarioEncontrado.password);

        if (!esPasswordValida) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        // 5. Respuesta de éxito
        return res.json({
            ok: true,
            mensaje: 'Inicio de sesión correcto.',
            usuario: {
                id: usuarioEncontrado.id,
                usuario: usuarioEncontrado.usuario,
                nombre: usuarioEncontrado.nombre
            }
        });

    } catch (error) {
        console.error('Error durante la autenticación:', error.message);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor.'
        });
    }
});


// =========================================
// INICIAR SERVIDOR
// =========================================

app.listen(PORT, () => {
    console.log(
        `Servidor backend ejecutándose en puerto ${PORT}`
    )
})