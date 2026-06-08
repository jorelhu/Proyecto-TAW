// src/pages/Profile.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut, Package, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  // Protección de ruta
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center justify-between border-b border-neutral-200 pb-8 sm:flex-row">
        <div>
          <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-neutral-900 mb-2">Mi Maison</h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Bienvenido de vuelta, {user.name}</p>
        </div>
        
        <button 
          onClick={logout}
          className="mt-6 flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 sm:mt-0 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
        {/* Detalles de la Cuenta */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 p-8 border border-neutral-100">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-5 w-5 text-neutral-900" />
              <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-900">Detalles de Cuenta</h2>
            </div>
            <div className="space-y-4 text-sm font-light text-neutral-600">
              <p><span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Nombre</span> {user.name}</p>
              <p><span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Email</span> {user.email}</p>
              <p><span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Miembro desde</span> Junio 2026</p>
            </div>
            <button className="mt-8 border-b border-neutral-900 pb-1 text-[10px] uppercase tracking-widest text-neutral-900 transition-opacity hover:opacity-60">
              Editar Preferencias
            </button>
          </div>
        </div>

        {/* Historial de Pedidos (Mock) */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-3 mb-8">
            <Package className="h-5 w-5 text-neutral-900" />
            <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-900">Historial de Pedidos</h2>
          </div>

          <div className="space-y-6">
            {/* Pedido de Ejemplo */}
            <div className="border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-sm">
              <div className="flex flex-col justify-between border-b border-neutral-100 pb-4 sm:flex-row sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-500">Orden #AN-8472</span>
                  <span className="text-sm font-light text-neutral-900">01 de Junio, 2026</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-block bg-neutral-900 px-3 py-1 text-[9px] uppercase tracking-widest text-white mb-2">Entregado</span>
                  <p className="text-sm font-medium text-neutral-900">$195.00</p>
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <div className="h-16 w-12 bg-neutral-100 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=200" alt="Perfume" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-900">Soleil Blanc</p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">100ml — Qty: 1</p>
                </div>
              </div>
            </div>
            
            {/* Puedes agregar más pedidos mock aquí si lo deseas */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;