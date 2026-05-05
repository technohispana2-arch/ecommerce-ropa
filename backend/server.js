/**
 * Punto de entrada del servidor Express
 * Configura la app, conecta a MongoDB y define las rutas de API
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
