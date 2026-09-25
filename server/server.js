import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import pool from './db.js'

dotenv.config()

const app = express()

const PORT = 3001


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
        mensaje: 'Servidor 444 ESSENCE funcionando'
    })
})


// =========================================
// LOGIN (Versión vulnerable adaptada para pruebas)
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

        // 2. Consulta SQL concatenada (vulnerable para la prueba)
        const query = `SELECT id, usuario, password, nombre FROM usuarios WHERE usuario = '${usuario}' AND password = '${password}'`;
        
        const [rows] = await pool.query(query);

        // 3. Verificar si la consulta devolvió resultados
        if (rows.length === 0) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        const usuarioEncontrado = rows[0];

        // 4. Respuesta de éxito
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
        console.error('Error en consulta SQL:', error.message);
        return res.status(401).json({
            ok: false,
            mensaje: 'Usuario o contraseña incorrectos.'
        });
    }
});


// =========================================
// INICIAR SERVIDOR
// =========================================

app.listen(PORT, () => {
    console.log(
        `Servidor backend ejecutándose en http://localhost:${PORT}`
    )
})