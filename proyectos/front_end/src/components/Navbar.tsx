// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';


const Navbar: React.FC = () => {
  // Extraemos la función para contar items y para abrir/cerrar el carrito
  const cartCount = useCartStore((state) => state.cartCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { isAuthenticated, user } = useAuthStore((state) => state);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          <div className="flex md:hidden">
            <button className="text-neutral-600 hover:text-neutral-900">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden md:flex space-x-8 uppercase tracking-widest text-xs font-medium text-neutral-600">
            <Link to="/shop" className="hover:text-neutral-900 transition-colors duration-200">
              Colecciones
            </Link>

          </div>

          <div className="flex flex-1 justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link to="/" className="text-2xl font-light tracking-[0.3em] uppercase text-neutral-900">
              Aura Nova
            </Link>
          </div>

          <div className="flex items-center space-x-6 text-neutral-600">
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" className="hidden text-[10px] font-medium uppercase tracking-widest text-neutral-400 hover:text-neutral-900 md:block transition-colors">
                Admin
              </Link>
            )}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="hover:text-neutral-900 transition-colors duration-200"
            >
              <User className="h-5 w-5 font-light" />
            </Link>

            {/* Cambiamos el Link por un button que activa el toggleCart */}
            <button
              onClick={toggleCart}
              className="relative hover:text-neutral-900 transition-colors duration-200"
            >
              <ShoppingBag className="h-5 w-5 font-light" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;