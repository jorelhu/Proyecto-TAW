// src/pages/Checkout.tsx
import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';

const Checkout: React.FC = () => {
  const { items, cartTotal } = useCartStore();
  const subtotal = cartTotal();
  const { user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinarCentro, setCoordinarCentro] = useState(false);

  const shippingCost = coordinarCentro ? 0 : 20;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-xl font-light tracking-[0.2em] uppercase text-emerald-900">Tu orden está vacía</h2>
        <Link to="/shop" className="text-xs uppercase tracking-widest text-emerald-500 underline hover:text-emerald-700">
          Explorar colecciones
        </Link>
      </div>
    );
  }

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert('Debes iniciar sesión para completar la orden.');
      return;
    }
    const orderData = {
      userId: user.id,
      total: total,
      items: items.map(item => ({
        variant: { id: item.variant.id, price: item.variant.price },
        quantity: item.quantity
      }))
    };

    try {
      await api.post('/orders', orderData);

      let message = `*Hola AURA NOVA, deseo realizar un pedido:*%0A%0A`;

      items.forEach((item) => {
        message += `• *${item.product.name}* (${item.variant.size})%0A`;
        message += `  Cantidad: ${item.quantity} | Subtotal: $${(item.variant.price * item.quantity).toFixed(2)}%0A%0A`;
      });

      message += `---%0A`;
      message += `*Total Neto:* $${total.toFixed(2)}%0A%0A`;
      message += `*Datos del Cliente:*%0A`;
      message += `• *Nombre:* ${user.name}%0A`;
      message += `• *Email:* ${user.email}`;

      window.open(`https://wa.me/59175209520?text=${message}`, '_blank');

      // useCartStore.getState().clearCart(); // si tienes la función

    } catch (error) {
      console.error("Error al registrar la orden:", error);
      alert("Hubo un error al procesar tu pedido.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/shop" className="mb-8 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-500 transition-colors hover:text-emerald-700">
        <ChevronLeft className="h-4 w-4" />
        <span>Volver a la tienda</span>
      </Link>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Formulario */}
        <div className="lg:col-span-7">
          <h1 className="mb-8 text-2xl font-light uppercase tracking-[0.1em] text-emerald-900">
            Finalizar Compra
          </h1>

          <form onSubmit={handleSendWhatsApp} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xs font-medium uppercase tracking-widest text-emerald-800">Contacto</h2>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light text-emerald-900 placeholder-emerald-400 focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-medium uppercase tracking-widest text-emerald-800">Información Personal</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                  className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-sm border border-emerald-200 bg-emerald-50 p-4">
              <input
                type="checkbox"
                id="coordinarCentro"
                checked={coordinarCentro}
                onChange={(e) => setCoordinarCentro(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-emerald-800"
              />
              <label htmlFor="coordinarCentro" className="cursor-pointer select-none text-xs font-medium uppercase tracking-wide text-emerald-800">
                Coordinar entrega en el centro (Sin costo de envío)
              </label>
            </div>

            {!coordinarCentro && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xs font-medium uppercase tracking-widest text-emerald-800">Dirección de Envío</h2>
                <input
                  type="text"
                  required={!coordinarCentro}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección completa (Calle, Número, Edificio/Apto)"
                  className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="mt-8 w-full bg-emerald-800 py-5 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-emerald-700"
            >
              Solicitar pedido por WhatsApp — ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Resumen de la Orden */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-emerald-50 p-8">
            <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-emerald-800">Resumen de la Orden</h2>

            <ul className="mb-8 max-h-[40vh] space-y-6 overflow-y-auto pr-2">
              {items.map((item) => {
                const primaryImage = item.product.images.find(img => img.isPrimary)?.imageUrl || item.product.images[0]?.imageUrl;
                return (
                  <li key={item.variant.id} className="flex space-x-4">
                    <div className="h-20 w-16 flex-shrink-0 bg-white">
                      <img src={primaryImage} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex justify-between">
                        <span className="text-xs uppercase tracking-wide text-emerald-900">{item.product.name}</span>
                        <span className="text-xs text-emerald-900">${(item.variant.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <span className="mt-1 text-[10px] uppercase tracking-widest text-emerald-500">
                        {item.variant.size} — Cantidad: {item.quantity}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-4 border-t border-emerald-200 pt-6 text-sm font-light text-emerald-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Envío</span>
                {coordinarCentro ? (
                  <span className="rounded-sm border border-emerald-200 bg-white px-2 py-1 text-[10px] uppercase tracking-widest text-emerald-500">Centro (Gratis)</span>
                ) : (
                  <span>$20.00</span>
                )}
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-4 text-base font-medium text-emerald-900">
                <span className="text-xs uppercase tracking-widest">Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;