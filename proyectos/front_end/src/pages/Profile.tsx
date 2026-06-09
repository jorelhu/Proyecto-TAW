import { useEffect, useState } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { api } from '../api/client'; // 1. Usamos tu cliente configurado (ajusta la ruta si es necesario)
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const token = localStorage.getItem('token');

        // 2. Usamos 'api.get' y solo la ruta relativa
        const response = await api.get('/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      cargarPedidos();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Encabezado */}
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

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
        {/* Detalles de la Cuenta (Ocupa 1 columna) */}
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

        {/* Historial de Pedidos Realizados (Ocupa 2 columnas) */}
        <div className="space-y-6 lg:col-span-2">
          {loading ? (
            <p className="text-sm uppercase tracking-widest text-neutral-400">Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm font-light text-neutral-500">No tienes pedidos realizados aún.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-neutral-200 bg-white p-6">
                <div className="flex justify-between border-b border-neutral-100 pb-4">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-500">Orden #{order.id}</span>
                    <span className="text-sm font-light text-neutral-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-neutral-900 px-3 py-1 text-[9px] uppercase tracking-widest text-white mb-2">
                      {order.status}
                    </span>
                    <p className="text-sm font-medium text-neutral-900">${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Iterar ítems del pedido */}
                <div className="divide-y divide-neutral-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center space-x-4 first:pt-4 last:pb-0">
                      <div className="h-16 w-12 bg-neutral-100 flex-shrink-0">
                        <img 
                          src={item.variant?.product?.imageUrl || 'https://via.placeholder.com/150'} 
                          alt={item.variant?.product?.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-neutral-900">{item.variant?.product?.name || 'Producto'}</p>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                          {item.variant?.size || 'U'} — Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;