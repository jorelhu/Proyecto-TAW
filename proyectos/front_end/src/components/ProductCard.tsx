// src/components/ProductCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { type Product } from '../types/';

// 👇 Define la URL base de tu backend (ajusta según tu entorno)
// o usa variable de entorno

interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const images = product.images || [];
  const variants = product.variants || [];

  // 🔁 Cambios limpios: usamos la URL directa sin variables duplicadas
  const primaryImageObj = images.find((img) => img.isPrimary) || images[0];
  const rawUrl = primaryImageObj?.url || primaryImageObj?.imageUrl;
  const imageUrl = rawUrl ? rawUrl : null;

  const basePrice = Number(variants[0]?.price) || 0;

  return (
    <div className="group relative flex flex-col bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl} // ✅ Ahora apunta al backend
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Si falla la carga, opcionalmente muestra un placeholder
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
            Sin imagen
          </div>
        )}
        {/* Botón Añadir (opcional, luego agregar funcionalidad) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <button className="flex w-full items-center justify-center space-x-2 bg-neutral-900/90 py-3 text-xs tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-neutral-900">
            <ShoppingBag className="h-4 w-4" />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col text-center">
        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium tracking-wide text-neutral-900">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          {basePrice > 0 ? `${basePrice.toFixed(2)} Bs.` : 'Próximamente'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;