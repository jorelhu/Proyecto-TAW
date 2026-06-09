// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Si ya tiene sesión, lo enviamos directo a su perfil
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  // Reemplaza la función handleSubmit en src/pages/Login.tsx con esto:

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Si el correo es el del admin, le damos el rol ADMIN
      const isSuperUser = email === 'admin@test.com';

      login({
        id: isSuperUser ? 1 : 2,
        name: isSuperUser ? 'Admin Aura' : 'Cliente Privé',
        email: email,
        role: isSuperUser ? 'ADMIN' : 'USER',
      });

      // Si es admin lo mandamos al dashboard, si es usuario al perfil
      navigate(isSuperUser ? '/admin' : '/profile');
    }, 800);
  };

  return (
    <div className="flex min-h-[85vh] w-full">
      {/* Columna de Imagen (Oculta en móviles) */}
      <div className="hidden w-1/2 bg-neutral-900 lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000"
          alt="Textura Aura Nova"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <h2 className="text-4xl font-light tracking-[0.2em] text-white uppercase mb-4">Acceso Privé</h2>
          <p className="text-sm font-light tracking-widest text-neutral-300 max-w-md leading-relaxed">
            Ingresa a tu cuenta para gestionar tus colecciones, revisar tus pedidos y acceder a lanzamientos exclusivos.
          </p>
        </div>
      </div>

      {/* Columna del Formulario */}
      <div className="flex w-full items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-2xl font-light uppercase tracking-[0.2em] text-neutral-900 mb-2">Bienvenido</h1>
            <p className="text-xs uppercase tracking-widest text-neutral-500">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light text-neutral-900 focus:border-neutral-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light text-neutral-900 focus:border-neutral-900 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 py-5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLoading ? 'Autenticando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 flex flex-col space-y-4 text-center lg:text-left">
            <button className="text-[10px] uppercase tracking-widest text-neutral-500 underline hover:text-neutral-900">
              ¿Olvidaste tu contraseña?
            </button>
            <Link to="/register" className="text-[10px] uppercase tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors font-medium">
              Crear una cuenta nueva
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;