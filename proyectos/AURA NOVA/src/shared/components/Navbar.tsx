import { ShoppingCart, Search, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // Asegúrate de que la ruta sea correcta
import { useCart } from "./CartContext";
import { useAuth } from "../../features/auth/context/AuthContext";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  // Calculamos la cantidad REAL de items en el carrito
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          {/* Si tu logo no se ve bien, puedes usar texto momentáneamente */}
          {/* <span className="text-2xl font-serif font-bold tracking-widest text-stone-900">AURA NOVA</span> */}
          <img
            src={logo}
            alt="Aura Nova"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Buscador Desktop */}
        <div className="flex-1 max-w-md hidden md:flex items-center bg-stone-100 rounded-full px-4 py-2 border border-transparent focus-within:border-stone-300 focus-within:bg-white focus-within:shadow-sm transition-all">
          <Search className="text-stone-400 w-4 h-4 mr-3" />
          <input
            type="text"
            placeholder="Encuentra tu esencia..."
            className="flex-1 bg-transparent outline-none text-sm text-stone-800 placeholder-stone-400"
          />
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-5 sm:gap-6 text-stone-600 shrink-0">

          <Link to="/productos" className="hidden sm:block text-sm font-medium hover:text-stone-950 transition-colors">
            Catálogo
          </Link>

          {/* Zona de Usuario */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-stone-800 hidden sm:block">
                Hola, {user.name}
              </span>
              <button 
                onClick={logout} 
                className="hover:text-stone-950 transition-colors p-1"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-stone-950 transition-colors p-1">
              <User className="w-5 h-5" />
            </Link>
          )}

          {/* Carrito */}
          <Link to="/carrito" className="relative group p-1">
            <ShoppingCart className="w-5 h-5 group-hover:text-stone-950 transition-colors" />

            {/* Contador dinámico corregido */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Buscador móvil (Se muestra debajo del logo en móviles) */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center bg-stone-100 rounded-full px-4 py-2 border border-stone-200 focus-within:border-stone-400 transition-colors">
          <Search className="text-stone-400 w-4 h-4 mr-3" />
          <input
            type="text"
            placeholder="Buscar fragancias..."
            className="flex-1 bg-transparent outline-none text-sm text-stone-800"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;