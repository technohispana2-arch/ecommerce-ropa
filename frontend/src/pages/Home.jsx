/**
 * Página de inicio
 * Muestra: hero, categorías, productos destacados
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ pageSize: 8 }),
          getCategories(),
        ]);
        setFeatured(productsData.products);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Nueva Colección
          </h1>
          <p className="text-xl mb-8">
            Descubre las últimas tendencias en moda
          </p>
          <Link
            to="/shop"
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Comprar Ahora
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-semibold">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
