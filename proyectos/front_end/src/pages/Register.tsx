// src/pages/Register.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const strength = useMemo(() => {
    if (!password) {
      return { level: 0, label: '', color: 'bg-transparent' };
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (password.length < 6) {
      return { level: 1, label: 'Débil', color: 'bg-red-500' };
    }

    return score < 3
      ? { level: 2, label: 'Intermedio', color: 'bg-amber-500' }
      : { level: 3, label: 'Fuerte', color: 'bg-emerald-500' };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (strength.level < 2) {
      alert("Por favor, utiliza una contraseña al menos de nivel Intermedio para proteger tu cuenta.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      alert('Cuenta de la Maison creada exitosamente. Procede al inicio de sesión.');
      navigate('/login');
    } catch (error: unknown) {
      console.error('Error en el registro:', error);
      const err = error as { response?: { data?: { message?: string | string[] } } };
      const msg = err.response?.data?.message || 'No se pudo crear la cuenta. El email podría estar en uso.';
      alert(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] w-full">
      {/* Columna del Formulario */}
      <div className="flex w-full items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-2xl font-light uppercase tracking-[0.2em] text-emerald-900 mb-2">Crear Cuenta</h1>
            <p className="text-xs uppercase tracking-widest text-emerald-600">Únete a nuestra Maison</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Nombre Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light text-emerald-900 focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

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

              {/* Medidor de Fuerza de Contraseña */}
              {password.length > 0 && (
                <div className="pt-2 animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase tracking-widest text-emerald-500">Seguridad:</span>
                    <span className={`text-[9px] uppercase tracking-widest font-medium ${strength.color.replace('bg-', 'text-')}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex h-1 w-full gap-1">
                    <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength.level >= 1 ? strength.color : 'bg-emerald-100'}`}></div>
                    <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength.level >= 2 ? strength.color : 'bg-emerald-100'}`}></div>
                    <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength.level >= 3 ? strength.color : 'bg-emerald-100'}`}></div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || strength.level < 2}
              className="w-full bg-emerald-800 py-5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <Link to="/login" className="text-[10px] uppercase tracking-widest text-emerald-600 underline hover:text-emerald-800">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Columna de Imagen (Oculta en móviles) */}
      <div className="hidden w-1/2 bg-emerald-900 lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1595535373192-fc89afe61233?q=80&w=1000"
          alt="Ingredientes Aura Nova"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <h2 className="text-4xl font-light tracking-[0.2em] text-white uppercase mb-4">El Inicio de un Viaje</h2>
          <p className="text-sm font-light tracking-widest text-emerald-100 max-w-md leading-relaxed">
            Formar parte de AURA NOVA es acceder a un mundo de creaciones olfativas sin precedentes, invitaciones a catas privadas y envíos de cortesía.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;