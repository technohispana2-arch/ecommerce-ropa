/**
 * Página del catálogo
 * Lista productos con paginación y filtros por categoría
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('keyword') || '';
  const page = searchParams.get('page') || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ category, keyword, page }),
          getCategories(),
        ]);
        setProducts(productsData.products);
        setPagination({
          page: productsData.page,
          pages: productsData.pages,
          total: productsData.total,
        });
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, keyword, page]);

  const handleCategory = (catSlug) => {
    const params = new URLSearchParams(searchParams);
    if (catSlug) {
      params.set('category', catSlug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    setSearchParams(params);
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
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-4">Categorías</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategory('')}
                className={`block w-full text-left px-3 py-2 rounded ${
                  !category ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategory(cat.slug)}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    category === cat.slug
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {category
                ? categories.find((c) => c.slug === category)?.name
                : 'Todos los Productos'}
            </h1>
            <span className="text-gray-600">
              {pagination.total} productos
            </span>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No se encontraron productos.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {[...Array(pagination.pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', x + 1);
                        setSearchParams(params);
                      }}
                      className={`px-4 py-2 rounded ${
                        pagination.page === x + 1
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {x + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
