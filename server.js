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

// Configura CORS para permitir solicitudes desde tu frontend
const corsOptions = {
  origin: 'https://lydytravel.site',  // Permitir solo solicitudes desde este dominio
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permitir estos métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization'],  // Permitir estos encabezados
};

app.use(cors(corsOptions));  // Habilitar CORS con la configuración
app.options('*', cors(corsOptions));  // Responder a solicitudes OPTIONS (preflight)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

// Las rutas *van primero*
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', postsRoutes);

// Sirve los archivos estáticos de tu frontend
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static('uploads'));

// Si el frontend está en producción, maneja la ruta principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
