
import axios from 'axios';

// Asegúrate de que este sea el puerto donde corre tu NestJS (por defecto suele ser 3000)
export const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Más adelante aquí mismo podemos agregar los interceptores para enviar el token JWT automáticamente