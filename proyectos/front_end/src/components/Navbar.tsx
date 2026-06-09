// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.cartCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { isAuthenticated, user } = useAuthStore((state) => state);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">

            {/* Botón menú móvil */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-emerald-700 hover:text-emerald-500 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación escritorio */}
            <div className="hidden md:flex space-x-8 uppercase tracking-widest text-xs font-medium text-emerald-700">
              <Link to="/shop" className="hover:text-emerald-500 transition-colors duration-200">
                Colecciones
              </Link>
            </div>

            {/* Logo centrado */}
            <div className="flex flex-1 justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
              <Link to="/" className="text-2xl font-light tracking-[0.3em] uppercase text-emerald-800 hover:text-emerald-600 transition-colors">
                Aura Nova
              </Link>
            </div>

            {/* Iconos derecha */}
            <div className="flex items-center space-x-5 text-emerald-700">
              {isAuthenticated && user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="hidden text-[10px] font-medium uppercase tracking-widest text-emerald-600 hover:text-emerald-800 md:block transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="hover:text-emerald-500 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={toggleCart}
                className="relative hover:text-emerald-500 transition-colors duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[9px] font-medium text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 z-40 h-screen w-full bg-white/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col items-center space-y-6 pt-10 text-sm uppercase tracking-widest text-emerald-800">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-500 transition-colors"
            >
              Colecciones
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-500 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;