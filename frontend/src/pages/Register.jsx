/**
 * Página de registro de usuario
 * Formulario: name, email, password, confirmPassword
 */
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate(redirect);
    } catch (err) {
      setError('Error al registrarse. El email ya podría estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
            className="text-blue-600 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
