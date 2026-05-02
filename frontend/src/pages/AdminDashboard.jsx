import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    images: [''],
    category: 'camisetas',
    sizes: ['M'],
    colors: ['Negro'],
    brand: '',
    stock: 0,
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
          body: JSON.stringify(formData),
        });
      }
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        images: [''],
        category: 'camisetas',
        sizes: ['M'],
        colors: ['Negro'],
        brand: '',
        stock: 0,
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      brand: product.brand,
      stock: product.stock,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      {/* Product Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Marca"
              required
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Precio"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Stock"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
              className="border rounded px-3 py-2"
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border rounded px-3 py-2"
            >
              {['camisetas', 'pantalones', 'vestidos', 'faldas', 'chaquetas', 'zapatos', 'accesorios'].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
          <textarea
            placeholder="Descripción"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            rows="3"
          />
          <input
            type="text"
            placeholder="URL de imagen"
            value={formData.images[0]}
            onChange={(e) =>
              setFormData({ ...formData, images: [e.target.value] })
            }
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              {editingProduct ? 'Actualizar' : 'Crear'} Producto
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    images: [''],
                    category: 'camisetas',
                    sizes: ['M'],
                    colors: ['Negro'],
                    brand: '',
                    stock: 0,
                  });
                }}
                className="border px-6 py-2 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Productos ({products.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Imagen</th>
                <th className="text-left py-2">Nombre</th>
                <th className="text-left py-2">Precio</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="py-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">${product.price.toFixed(2)}</td>
                  <td className="py-2">{product.stock}</td>
                  <td className="py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
