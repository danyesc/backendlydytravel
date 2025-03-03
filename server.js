require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose'); // Importa Mongoose

const upload = require('./routes/posts').upload; // Importa la configuración de Multer desde routes/posts.js

const app = express();
const postsRoutes = require('./routes/posts');
const UserRoutes = require('./routes/users');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar con MongoDB:', err));

// Configura CORS para permitir solicitudes desde tu frontend
const corsOptions = {
    origin: 'https://lydytravel.site',  // Permitir solo solicitudes desde este dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permitir estos métodos HTTP
    allowedHeaders: ['Content-Type', 'Authorization'],  // Permitir estos encabezados
    credentials: true // IMPORTANTE: Permite el envío de cookies y autenticación
};
  };
  
  app.use(cors(corsOptions));  // Habilitar CORS con la configuración

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Las rutas *van primero*
app.use('/api/users', UserRoutes);
app.use('/api/posts', postsRoutes);

app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static('uploads'));

// Puerto de escucha
app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
