/**
 * Página de proceso de pago
 * Formulario de dirección, método de pago, crea orden
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = items.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      size: item.size,
      color: item.color,
      product: item._id,
    }));

    const orderData = {
      orderItems,
      shippingAddress: shipping,
      paymentMethod,
      itemsPrice: total,
      taxPrice: 0,
      shippingPrice: total >= 50 ? 0 : 5,
      totalPrice: total + (total >= 50 ? 0 : 5),
    };

    try {
      await createOrder(orderData);
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error(error);
      alert('Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login?redirect=checkout');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Dirección"
                required
                value={shipping.address}
                onChange={(e) =>
                  setShipping({ ...shipping, address: e.target.value })
                }
                className="w-full border rounded px-4 py-2"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ciudad"
                  required
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                  className="border rounded px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Código Postal"
                  required
                  value={shipping.postalCode}
                  onChange={(e) =>
                    setShipping({ ...shipping, postalCode: e.target.value })
                  }
                  className="border rounded px-4 py-2"
                />
              </div>
              <input
                type="text"
                placeholder="País"
                required
                value={shipping.country}
                onChange={(e) =>
                  setShipping({ ...shipping, country: e.target.value })
                }
                className="w-full border rounded px-4 py-2"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
            <div className="space-y-2">
              {['tarjeta', 'paypal', 'transferencia'].map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          {items.map((item) => (
            <div key={item.cartId} className="flex justify-between py-2 border-b">
              <span>
                {item.name} ({item.size}) x{item.qty}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 space-y-2">
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
        </div>
      </div>
    </div>
  );
}
