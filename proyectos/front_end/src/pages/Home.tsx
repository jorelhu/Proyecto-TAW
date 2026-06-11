// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard'; // 1. Importamos tus tarjetas reales
import { type Product } from '../types'; // Importamos tu tipo centralizado

const Home: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Intersection Observer para animaciones fluidas al hacer scroll
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  // Carga de productos desde el Catálogo Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getAll();
        // Tomamos los primeros 4 productos para mantener simetría en el grid premium
        setFeaturedProducts(products.slice(0, 4) as unknown as Product[]);
        setError(null);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron sincronizar las fragancias de la colección.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col w-full bg-white animate-fadeIn">
      
      {/* 1. Hero Section (Inmersión de Marca) */}
      <section className="relative h-[90vh] min-h-[650px] w-full bg-emerald-950">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://img.magnific.com/fotos-premium/botella-vidrio-perfume-manos-femeninas-suaves-novia-rocia-perfume-su-cuerpo-foto-primer-plano-manicure-manana-novia_964739-10947.jpg?semt=ais_hybrid&w=740&q=80"
            alt="AURA NOVA Esencia Natural"
            className="h-full w-full object-cover opacity-35 transition-transform duration-10000 scale-100 hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-neutral-900/30 to-white" />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 text-xs font-light tracking-[0.4em] text-emerald-200 uppercase">
            Alta Perfumería Botánica
          </span>
          <h1 className="mb-6 text-5xl font-light tracking-[0.25em] text-white uppercase sm:text-7xl lg:text-8xl">
            Aura Nova
          </h1>
          <p className="mb-12 max-w-xl text-xs font-light leading-relaxed tracking-[0.15em] text-emerald-100/90 uppercase">
            Esculturas olfativas inspiradas en la naturaleza.<br />
            Conexión orgánica entre esencia y sostenibilidad.
          </p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-4 border border-white/80 px-10 py-4 text-xs font-light uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-emerald-950 hover:border-white"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      </section>

      {/* 2. Sección "Esencia Natural" (Manifiesto Editorial) */}
      <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 reveal-on-scroll">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="order-2 lg:order-1 flex flex-col justify-center pr-0 lg:pr-8">
            <span className="mb-2 text-[10px] tracking-[0.3em] uppercase text-emerald-500 font-medium">Filosofía Orgánica</span>
            <h2 className="mb-8 text-3xl font-light tracking-[0.2em] text-emerald-900 uppercase sm:text-4xl">
              Esencia Natural
            </h2>
            <div className="space-y-6 text-sm font-light leading-relaxed tracking-wide text-neutral-600">
              <p>
                Inspirados por la exuberancia de los ecosistemas y bosques ancestrales, nuestros perfumes capturan la pureza en crudo de la botánica en cada mililitro.
              </p>
              <p>
                Seleccionamos aceites e ingredientes orgánicos combinados con envases de vidrio de alta densidad reciclables. Creemos firmemente que el verdadero lujo reside en el equilibrio y el respeto por nuestro entorno.
              </p>
            </div>
            <div className="mt-10">
              <Link to="/about" className="inline-flex items-center gap-3 border-b border-neutral-400 pb-1 text-xs uppercase tracking-widest text-neutral-800 transition-colors hover:text-emerald-700 hover:border-emerald-700">
                <span>Nuestra herencia</span>
                <Leaf className="h-3 w-3 text-emerald-500" />
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            {/* Removido redondeado (rounded-2xl) para adoptar cortes ortogonales limpios */}
            <div className="aspect-[4/5] overflow-hidden bg-neutral-50 shadow-sm">
              <img
                src="https://aromasfenpal.com/wp-content/uploads/2025/01/perfume-fecha-de-caducidad-1536x1025.jpg"
                alt="Ingredientes botánicos y destilación"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-103"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Galería de Inspiración Botánica (Estilo Editorial) */}
      <section ref={galleryRef} className="bg-neutral-50/60 border-t border-b border-neutral-100 py-24 reveal-on-scroll">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 block mb-2">Atmósfera</span>
            <h2 className="text-2xl font-light tracking-[0.2em] text-neutral-800 uppercase">Inspiración de la Tierra</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {[
              "https://farmacorp.com/cdn/shop/files/6975525902402_704x704.jpg?v=1769026632",
              "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800",
              "https://farmacorp.com/cdn/shop/files/7506306249998_704x704.jpg?v=1769026257",
              "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800"
            ].map((url, i) => (
              <div key={i} className="overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-md">
                <img 
                  src={url} 
                  alt={`Inspiración visual AURA NOVA ${i + 1}`} 
                  className="h-72 w-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                  loading="lazy" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Productos Destacados (Integración de Catálogo Real) */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-500 block mb-2">Selección Exclusiva</span>
          <h2 className="text-2xl font-light tracking-[0.2em] text-neutral-900 uppercase">Fragancias Destacadas</h2>
        </div>
        
        {/* Estados de Carga Estilizados */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-800 border-t-transparent"></div>
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase animate-pulse">Sincronizando elixires...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center text-xs tracking-widest text-red-500 uppercase py-16">
            {error}
          </div>
        )}
        
        {!loading && !error && featuredProducts.length === 0 && (
          <div className="text-center text-xs tracking-widest text-neutral-400 uppercase py-16">
            La bóveda de fragancias está cerrada temporalmente.
          </div>
        )}
        
        {/* Renderizado usando el componente ProductCard reutilizable */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Botón de acción para ver todo el catálogo */}
        {!loading && !error && featuredProducts.length > 0 && (
          <div className="mt-16 text-center">
            <Link
              to="/shop"
              className="inline-block border border-neutral-900 px-12 py-4 text-xs font-light uppercase tracking-[0.2em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Ver Toda la Colección
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;