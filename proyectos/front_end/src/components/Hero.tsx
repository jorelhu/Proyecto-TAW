import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-emerald-900">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=2070"
          srcSet="
            https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=800 800w,
            https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=1200 1200w
          "
          sizes="100vw"
          alt="Botellas de perfume rodeadas de hojas verdes"
          className="h-full w-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-emerald-800/40 to-emerald-900/70" />
      </div>
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center animate-fade-in-up">
        <span className="mb-4 text-xs font-light tracking-[0.3em] text-emerald-200 uppercase">
          Nueva Colección Verde
        </span>
        <h1 className="mb-6 text-5xl font-light tracking-[0.2em] text-white uppercase sm:text-7xl">
          Aura Nova
        </h1>
        <p className="mb-10 max-w-lg text-sm font-light leading-relaxed tracking-widest text-emerald-50">
          Esculturas olfativas inspiradas en la naturaleza.<br />
          Conexión orgánica entre esencia y sostenibilidad.
        </p>
        <Link
          to="/shop"
          className="group inline-flex items-center gap-3 border border-emerald-300 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-600 focus:ring-emerald-500"
        >
          <span>Descubrir la Colección</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;