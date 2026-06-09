import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const LaMaison: React.FC = () => {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="order-2 lg:order-1">
        <h2 className="mb-6 text-3xl font-light tracking-[0.15em] text-emerald-800 uppercase sm:text-4xl">
          Esencia Natural
        </h2>
        <div className="space-y-4 text-sm font-light leading-relaxed tracking-wide text-emerald-700">
          <p>
            Inspirados por la exuberancia de los bosques ancestrales. Nuestros perfumes capturan la pureza de la naturaleza en cada gota.
          </p>
          <p>
            Ingredientes orgánicos, envases reciclables y un compromiso con el medio ambiente. El lujo sostenible es posible.
          </p>
        </div>
        <div className="mt-8">
          <Link to="/about" className="inline-flex items-center gap-2 border-b border-emerald-600 pb-1 text-xs font-medium uppercase tracking-widest text-emerald-800 hover:text-emerald-600">
            Conoce nuestra historia <Leaf className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1592911597212-5e6a6780da62?q=80&w=800"
            alt="Ingredientes botánicos"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default LaMaison;