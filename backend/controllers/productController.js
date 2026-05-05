/**
 * Controlador de Productos
 * Funciones: getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories
 */
const Product = require('../models/Product');

// Lista productos con paginación, filtrado por categoría y búsqueda por keyword
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    const category = req.query.category;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const categoryFilter = category ? { category } : {};

    const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
    const products = await Product.find({ ...keyword, ...categoryFilter })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nuevo producto (solo admin)
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: 'Nueva Prenda',
      description: 'Descripción de la prenda',
      price: 0,
      images: ['https://via.placeholder.com/500'],
      category: 'camisetas',
      sizes: ['M'],
      colors: ['Negro'],
      brand: 'Marca',
      stock: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar producto (solo admin)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, sizes, colors, brand, stock } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.images = images || product.images;
      product.category = category || product.category;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.brand = brand || product.brand;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar producto (solo admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar categorías disponibles
const getCategories = async (req, res) => {
  try {
    const categories = [
      { name: 'Camisetas', slug: 'camisetas', icon: '👕' },
      { name: 'Pantalones', slug: 'pantalones', icon: '👖' },
      { name: 'Vestidos', slug: 'vestidos', icon: '👗' },
      { name: 'Faldas', slug: 'faldas', icon: '🩳' },
      { name: 'Chaquetas', slug: 'chaquetas', icon: '🧥' },
      { name: 'Zapatos', slug: 'zapatos', icon: '👟' },
      { name: 'Accesorios', slug: 'accesorios', icon: '👜' },
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
