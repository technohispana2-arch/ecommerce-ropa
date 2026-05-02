import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
           RICKY RICCARDI
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Inicio
          </Link>
          <Link to="/shop" className="text-gray-600 hover:text-gray-900">
            Tienda
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-gray-900">
            Carrito
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <span className="text-2xl">🛒</span>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {items.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{user.name}</span>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm bg-gray-800 text-white px-3 py-1 rounded"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link
                to="/login"
                className="text-sm bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm border border-gray-800 px-4 py-2 rounded hover:bg-gray-100"
              >
                Registro
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
