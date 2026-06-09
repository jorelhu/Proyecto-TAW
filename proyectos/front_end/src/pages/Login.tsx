// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || (data.user.email === 'admin@test.com' ? 'ADMIN' : 'USER')
      });

      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err: unknown) {
      console.error('Error de autenticación:', err);

      type ErrorResponse = {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      };

      const error = err as ErrorResponse;
      const msg = error.response?.data?.message || 'Credenciales inválidas. Inténtalo de nuevo.';
      alert(typeof msg === 'object' ? msg[0] : msg); // Maneja errores de DTOs
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] w-full">
      {/* Columna de Imagen */}
      <div className="hidden w-1/2 bg-emerald-900 lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000"
          alt="Textura Aura Nova"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <h2 className="mb-4 text-4xl font-light tracking-[0.2em] uppercase text-white">Acceso Privé</h2>
          <p className="max-w-md text-sm font-light leading-relaxed tracking-widest text-emerald-100">
            Ingresa a tu cuenta para gestionar tus colecciones, revisar tus pedidos y acceder a lanzamientos exclusivos.
          </p>
        </div>
      </div>

      {/* Columna del Formulario */}
      <div className="flex w-full items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="mb-2 text-2xl font-light uppercase tracking-[0.2em] text-emerald-800">Bienvenido</h1>
            <p className="text-xs uppercase tracking-widest text-emerald-600">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light text-emerald-900 focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light text-emerald-900 focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-800 py-5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? 'Autenticando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 flex flex-col space-y-4 text-center lg:text-left">
            <button className="text-[10px] uppercase tracking-widest text-emerald-500 underline hover:text-emerald-700">
              ¿Olvidaste tu contraseña?
            </button>
            <Link to="/register" className="text-[10px] font-medium uppercase tracking-widest text-emerald-800 transition-colors hover:text-emerald-600">
              Crear una cuenta nueva
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;