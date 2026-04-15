// src/shared/components/Navbar.tsx
import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full bg-white border-b border-stone-100 sticky top-0 z-50 transition-all">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-10">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-serif font-bold tracking-widest text-stone-900"
        >
          AURA NOVA
        </Link>

        {/* Buscador */}
        <div className="flex-1 flex items-center bg-stone-100 rounded-full px-4 py-2 border border-stone-200 focus-within:border-stone-400 focus-within:bg-white focus-within:shadow-sm transition-all">
          <Search className="text-stone-500 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Encuentra tu esencia..."
            className="flex-1 bg-transparent outline-none text-sm text-stone-800 placeholder-stone-500"
          />
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-6 text-stone-700">
          
          {/* Catálogo */}
          <Link
            to="/productos"
            className="text-sm font-medium hover:text-stone-950 transition-colors"
          >
            Catálogo
          </Link>

          {/* Usuario */}
          <Link to="/login" className="group">
            <User className="w-6 h-6 text-stone-600 group-hover:text-stone-950 transition-colors" />
          </Link>

          {/* Carrito */}
          <Link to="/carrito" className="relative group">
            <ShoppingCart className="w-6 h-6 text-stone-600 group-hover:text-stone-950 transition-colors" />
            
            <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Navbar;