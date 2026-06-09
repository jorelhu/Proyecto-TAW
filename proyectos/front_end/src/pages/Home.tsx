// src/pages/Home.tsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
// No necesitas Menu, ShoppingBag, User porque ya están en el Navbar global

const Home: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - sin el header duplicado */}
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

      {/* Sección "Esencia Natural" */}
      <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8 reveal-on-scroll">
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
      </section>

      {/* Galería de imágenes */}
      <section ref={galleryRef} className="bg-emerald-50 py-16 reveal-on-scroll">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-light tracking-[0.15em] text-emerald-800 uppercase">Inspiración Botánica</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800",
              "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800",
              "https://images.unsplash.com/photo-1615397323068-d06990bf9e39?q=80&w=800",
              "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800"
            ].map((url, i) => (
              <div key={i} className="overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl">
                <img src={url} alt={`Galeria ${i+1}`} className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-light tracking-[0.15em] text-emerald-800 uppercase">Productos Destacados</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => (
            <div key={i} className="group rounded-2xl bg-white p-4 shadow-md transition-shadow hover:shadow-xl">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img src={`https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800`} alt="Perfume" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <h3 className="mt-4 text-center text-lg font-light text-emerald-800">Aura Verde Nº{i}</h3>
              <p className="text-center text-sm text-emerald-600">€ {89 + i*10}</p>
              <button className="mt-3 w-full border border-emerald-600 py-2 text-xs uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-600 hover:text-white">
                Ver producto
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;