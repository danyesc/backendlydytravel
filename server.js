require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose');

const upload = require('./routes/posts').upload; // Importa la configuración de Multer
const postsRoutes = require('./routes/posts');

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar con MongoDB:', err));

// ✅ Configuración de CORS
const corsOptions = {
    origin: 'https://lydytravel.site',  // Permitir solo solicitudes desde este dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Encabezados permitidos
    credentials: true  // Permitir el envío de cookies y tokens de autenticación
};

app.use(cors(corsOptions));

// ✅ Middleware para asegurarse de que las respuestas incluyan los encabezados CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://lydytravel.site'); // Permitir solo este dominio
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // Permitir cookies y credenciales

    // ✅ Responder correctamente a las preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', postsRoutes);

app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static('uploads'));

// ✅ Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
