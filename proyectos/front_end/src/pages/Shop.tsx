// src/pages/Shop.tsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types';
import { api } from '../api/client'; // Importamos tu instancia de Axios configurada

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Llamada real a la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Hacemos el GET al backend de NestJS
        const { data } = await api.get<Product[]>('/products');
        setProducts(data);
      } catch (err) {
        console.error('Error al cargar los productos:', err);
        setError('Tuvimos un problema al cargar la colección. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Encabezado de la página */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-neutral-900 mb-4">
          La Colección
        </h1>
        <p className="text-sm tracking-wide text-neutral-500 max-w-2xl mx-auto font-light">
          Descubre nuestras firmas olfativas. Cada fragancia es una obra de arte destilada.
        </p>
      </div>

      {/* Manejo de Estados: Cargando, Error o Catálogo */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-xs uppercase tracking-widest text-neutral-400 animate-pulse">
            Cargando colección...
          </span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-xs uppercase tracking-widest text-red-500">
            {error}
          </span>
        </div>
      ) : products.length === 0 ? (
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