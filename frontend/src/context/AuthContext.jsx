/**
 * Contexto de autenticación
 * Provee: user, loading, login, register, logout
 * Conserva sesión en localStorage
 */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura sesión desde localStorage al iniciar
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Login: POST /api/users/login
  const login = async (email, password) => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post(
      'http://localhost:5000/api/users/login',
      { email, password },
      config
    );
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Register: POST /api/users/register
  const register = async (name, email, password) => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post(
      'http://localhost:5000/api/users/register',
      { name, email, password },
      config
    );
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Logout: limpia localStorage
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
