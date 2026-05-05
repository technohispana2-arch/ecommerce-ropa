/**
 * Página de detalle de producto
 * Muestra: imagen, descripción, tallas, colores, precio con timer de oferta
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../utils/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Timer de oferta (15 min)
  useEffect(() => {
    const storageKey = `offer_timer_${id}`;
    const savedEndTime = localStorage.getItem(storageKey);

    let endTime;
    if (savedEndTime) {
      endTime = parseInt(savedEndTime);
    } else {
      endTime = Date.now() + 15 * 60 * 1000;
      localStorage.setItem(storageKey, endTime.toString());
    }

    const updateTimer = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft(0);
        setTimerExpired(true);
        return;
      }
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Producto no encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize, selectedColor);
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        ← Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[0] || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-500 uppercase">{product.brand}</p>
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          <div className="flex items-center mt-2">
            <span className="text-yellow-400 text-xl">★</span>
            <span className="ml-2 text-gray-600">
              {product.rating || 0} ({product.numReviews || 0} reseñas)
            </span>
          </div>
          <p className="text-3xl font-bold mt-4">${product.price.toFixed(2)}</p>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Talla</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? 'bg-gray-900 text-white'
                        : 'hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Color: {selectedColor}</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color
                        ? 'border-gray-900'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Cantidad</h3>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border rounded px-3 py-2"
            >
              {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {product.stock} en stock
            </p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-8 w-full py-3 rounded-lg font-semibold text-white ${
              product.stock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </button>

          {/* Offer Timer */}
          {!timerExpired && timeLeft !== null && (
            <div className="mt-4 text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-semibold mb-1">
                ⚡ OFERTA POR TIEMPO LIMITADO
              </p>
              <div className="text-2xl font-bold text-red-600 font-mono">
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ¡Solo {product.stock} unidades disponibles!
              </p>
            </div>
          )}

          {timerExpired && (
            <div className="mt-4 text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                ⏰ La oferta ha expirado. El precio puede cambiar pronto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
