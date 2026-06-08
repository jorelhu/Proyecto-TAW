// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section a pantalla completa */}
      <section className="relative h-[85vh] w-full bg-neutral-900">
        {/* Imagen de fondo con overlay para oscurecer */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1615397323068-d06990bf9e39?q=80&w=2000"
            alt="Fondo Aura Nova"
            className="h-full w-full object-cover opacity-60"
          />
        </div>
        
        {/* Contenido del Hero */}
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 text-xs tracking-[0.3em] text-neutral-300 uppercase">
            Nueva Colección
          </span>
          <h1 className="mb-6 text-5xl font-light tracking-[0.2em] text-white uppercase sm:text-7xl">
            Aura Nova
          </h1>
          <p className="mb-10 max-w-lg text-sm font-light tracking-widest text-neutral-200">
            Esculturas olfativas diseñadas para evocar memorias atemporales. 
            El arte de la perfumería llevado a su máxima expresión.
          </p>
          <Link
            to="/shop"
            className="group flex items-center space-x-3 border border-white px-8 py-4 text-xs uppercase tracking-widest text-white transition-all hover:bg-white hover:text-neutral-900"
          >
            <span>Descubrir la Colección</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Sección "La Maison" (Filosofía de la marca) */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Texto descriptivo */}
          <div className="order-2 lg:order-1">
            <h2 className="mb-6 text-3xl font-light tracking-[0.15em] text-neutral-900 uppercase">
              La Esencia del Tiempo
            </h2>
            <div className="space-y-4 text-sm font-light leading-relaxed tracking-wide text-neutral-600">
              <p>
                En AURA NOVA, no hacemos simplemente perfumes; destilamos emociones. 
                Nuestros maestros perfumistas viajan por el mundo seleccionando a mano 
                los ingredientes más puros y exóticos.
              </p>
              <p>
                Cada frasco es el resultado de meses de maceración y un cuidado obsesivo 
                por los detalles. Desde la madera de Oud más oscura hasta la luz radiante 
                del Ylang-Ylang.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/about"
                className="inline-block border-b border-neutral-900 pb-1 text-xs uppercase tracking-widest text-neutral-900 transition-opacity hover:opacity-60"
              >
                Conoce nuestra historia
              </Link>
            </div>
          </div>

          {/* Imagen de apoyo */}
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800"
                alt="Ingredientes de perfumería"
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;