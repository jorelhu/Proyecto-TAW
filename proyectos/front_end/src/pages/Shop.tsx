// src/pages/Shop.tsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types';
import { api } from '../api/client';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get<Product[]>('/products');
        
        console.log('1. Datos cargados con éxito de NestJS:', data);
        setProducts(data);
      } catch (err: unknown) {
        console.error('Error en la petición Axios:', err);
        setError('Error al conectar con el servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-xs uppercase tracking-widest text-neutral-400 animate-pulse">
          Cargando colección...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-xs uppercase tracking-widest">
        {error}
      </div>
    );
  }

  // CONTROL: Esto nos dirá exactamente cuántos productos intentará dibujar antes de que se ponga en blanco
  console.log('2. Renderizando el catálogo con productos:', products);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-neutral-900 mb-4">
          La Colección
        </h1>
        <p className="text-sm tracking-wide text-neutral-500 max-w-2xl mx-auto font-light">
          Descubre nuestras firmas olfativas. Cada fragancia es una obra de arte destilada.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            Aún no hay fragancias en la colección.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;