// src/pages/Shop.tsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types';

// Datos de prueba temporales (Simulando la respuesta de NestJS)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Mystic Oud',
    brand: 'AURA NOVA Privé',
    description: 'Una fragancia magnética y profunda...',
    variants: [{ id: 1, productId: 1, size: '50ml', price: 120.00, stock: 15 }],
    images: [{ id: 1, productId: 1, imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Soleil Blanc',
    brand: 'AURA NOVA Fresh',
    description: 'Un escape solar encapsulado...',
    variants: [{ id: 3, productId: 2, size: '50ml', price: 95.00, stock: 20 }],
    images: [{ id: 2, productId: 2, imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulamos la carga desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      // Aquí irá tu llamada a Axios: const { data } = await api.get('/products');
      setTimeout(() => {
        setProducts(mockProducts);
        setIsLoading(false);
      }, 800); // Simulamos 800ms de retraso de red
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

      {/* Grid de Productos */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-xs uppercase tracking-widest text-neutral-400">Cargando colección...</span>
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