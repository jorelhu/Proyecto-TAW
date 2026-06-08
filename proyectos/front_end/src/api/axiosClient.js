import axios from 'axios';

// Usamos una variable de entorno para la URL del backend
// Por ahora apuntará a local, luego a producción
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token de autenticación (JWT) si el usuario inicia sesión
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auranova_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;