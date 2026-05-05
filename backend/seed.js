/**
 * Script para sembrar la base de datos con productos de ejemplo
 * Ejecutar con: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Camiseta Básica Blanca',
    description: 'Camiseta básica de algodón 100%, perfecta para el día a día. Corte regular y cuello redondo.',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    category: 'camisetas',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Negro', 'Gris'],
    brand: 'BasicWear',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
  },
  {
    name: 'Pantalón Jeans Slim Fit',
    description: 'Jeans slim fit con elastano para mayor comodidad. Ideal para un look casual o semi-formal.',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    category: 'pantalones',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Azul Oscuro', 'Negro', 'Gris'],
    brand: 'DenimCo',
    stock: 35,
    rating: 4.3,
    numReviews: 89,
  },
  {
    name: 'Vestido Floral Verano',
    description: 'Vestido ligero con estampado floral, perfecto para días calurosos. Tirantes ajustables.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
    category: 'vestidos',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Rosa', 'Floral Azul'],
    brand: 'SummerBreeze',
    stock: 25,
    rating: 4.7,
    numReviews: 56,
  },
  {
    name: 'Falda Midi Pliegues',
    description: 'Falda midi con pliegues elegantes. Perfecta para la oficina o una cena formal.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500'],
    category: 'faldas',
    sizes: ['S', 'M', 'L'],
    colors: ['Negro', 'Beige', 'Navy'],
    brand: 'ElegantStyle',
    stock: 30,
    rating: 4.4,
    numReviews: 42,
  },
  {
    name: 'Chaqueta de Cuero Sintético',
    description: 'Chaqueta de cuero sintético con cierre frontal y bolsillos laterales. Un básico para tu closet.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    category: 'chaquetas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Marrón'],
    brand: 'UrbanLeather',
    stock: 20,
    rating: 4.6,
    numReviews: 73,
  },
  {
    name: 'Zapatillas Running Pro',
    description: 'Zapatillas deportivas con amortiguación avanzada. Ideales para correr o entrenar en el gimnasio.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    category: 'zapatos',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Negro', 'Blanco', 'Gris'],
    brand: 'SportMax',
    stock: 40,
    rating: 4.8,
    numReviews: 156,
  },
  {
    name: 'Bolso Crossbody Clásico',
    description: 'Bolso crossbody de cuero sintético con múltiples compartimentos. Perfecto para el día a día.',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'],
    category: 'accesorios',
    sizes: ['Único'],
    colors: ['Negro', 'Marrón', 'Beige'],
    brand: 'BagStudio',
    stock: 45,
    rating: 4.2,
    numReviews: 38,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');

    await Product.deleteMany({});
    console.log('Productos eliminados');

    await Product.insertMany(sampleProducts);
    console.log('Productos de ejemplo agregados');

    console.log('Seed completado');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
