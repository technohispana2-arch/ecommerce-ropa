/**
 * Página del carrito de compras
 * Lista items, permite modificar cantidad, muestra resumen del pedido
 */
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, total, updateQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-8">
          Parece que aún no has agregado nada.
        </p>
        <Link
          to="/shop"
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800"
        >
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartId}
              className="bg-white p-4 rounded-lg shadow flex gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <Link
                  to={`/product/${item._id}`}
                  className="font-semibold hover:text-blue-600"
                >
                  {item.name}
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                  Talla: {item.size} | Color: {item.color}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.qty > 1) updateQty(item.cartId, item.qty - 1);
                      }}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.cartId, item.qty + 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>${(total >= 50 ? 0 : 5).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${(total + (total >= 50 ? 0 : 5)).toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold"
          >
            Proceder al Pago
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
