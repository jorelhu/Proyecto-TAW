// src/shared/components/Navbar.tsx
import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCart } from "./CartContext";
const Navbar = () => {
const { cart } = useCart();
  return (
    <header className="w-full bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Aura Nova"
            className="h-30 w-auto object-contain"
          />
        </Link>

        {/* Buscador */}
        <div className="flex-1 max-w-xl hidden md:flex items-center bg-stone-100 rounded-full px-4 py-2 border border-stone-200 focus-within:border-teal-600 focus-within:bg-white focus-within:shadow-sm transition-all">
          <Search className="text-stone-500 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Encuentra tu esencia..."
            className="flex-1 bg-transparent outline-none text-sm text-stone-800 placeholder-stone-500"
          />
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-5 text-stone-700 shrink-0">
          
          {/* Catálogo */}
          <Link
            to="/productos"
            className="hidden sm:block text-sm font-medium hover:text-teal-700 transition-colors"
          >
            Catálogo
          </Link>

          {/* Usuario */}
          <Link to="/login" className="group">
            <User className="w-6 h-6 text-stone-600 group-hover:text-teal-700 transition-colors" />
          </Link>

          {/* Carrito */}
        <Link to="/carrito" className="relative group">
          <ShoppingCart className="w-6 h-6 text-stone-600 group-hover:text-teal-700 transition-colors" />

          {/* contador dinámico */}
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-teal-700 text-white text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </Link> 
        </div>
      </div>

      {/* Buscador móvil */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center bg-stone-100 rounded-full px-4 py-2 border border-stone-200">
          <Search className="text-stone-500 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Buscar..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;