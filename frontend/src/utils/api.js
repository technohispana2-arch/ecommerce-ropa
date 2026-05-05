/**
 * Helper de API con axios
 * Intercepta requests para añadir token JWT automáticamente
 */
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Añade token JWT a cada request
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// GET /products (con paginación, category, keyword)
export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

// GET /products/:id
export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

// GET /products/categories
export const getCategories = async () => {
  const { data } = await api.get('/products/categories');
  return data;
};

// POST /orders
export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

// GET /orders/myorders
export const getMyOrders = async () => {
  const { data } = await api.get('/orders/myorders');
  return data;
};

export default api;
