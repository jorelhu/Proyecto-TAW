import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);

    if (!success) {
      setError("Las credenciales ingresadas no son correctas.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Mitad Izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-stone-900 inline-block mb-12">
              AURA NOVA
            </Link>
            <h1 className="text-4xl font-serif font-bold text-stone-950 mb-3">
              Bienvenido de nuevo
            </h1>
            <p className="text-stone-500 font-light">
              Ingresa a tu cuenta para gestionar tus pedidos y descubrir nuevas fragancias.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-stone-300 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50 focus:bg-white"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-stone-300 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-stone-50 focus:bg-white"
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 group mt-2">
              Iniciar Sesión
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-sm text-center mt-10 text-stone-400">
            Credenciales de prueba:<br/>
            <span className="font-medium text-stone-600">admin@test.com / 123456</span>
          </p>

        </div>
      </div>

      {/* Mitad Derecha: Imagen decorativa (Oculta en móviles) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-stone-900">
        <img 
          src="https://www.esenzzia.com/modules/xtoblog/views/img/post/1669282735_happy-mothers-day-g16c02e28d_1920.jpg" 
          alt="Frascos de perfume elegantes" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end p-16">
          <p className="text-white text-3xl font-serif max-w-lg leading-tight">
            "El perfume es la llave de nuestros recuerdos."
          </p>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;