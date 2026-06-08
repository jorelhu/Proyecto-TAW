// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { type Product } from '../types/';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Buscamos la imagen principal, o tomamos la primera si no hay ninguna marcada
  const primaryImage = product.images.find((img) => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl;
  
  // Tomamos el precio de la primera variante como precio base
  const basePrice = product.variants[0]?.price || 0;

  return (
    <div className="group relative flex flex-col bg-white">
      {/* Contenedor de la Imagen con efecto hover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300">
            Sin imagen
          </div>
        )}
        
        {/* Botón de acción rápida (Aparece al hacer hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex w-full items-center justify-center space-x-2 bg-neutral-900/90 py-3 text-xs tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-neutral-900">
            <ShoppingBag className="h-4 w-4" />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="mt-4 flex flex-col text-center">
        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium tracking-wide text-neutral-900">
          <Link to={`/product/${product.id}`}>
            {/* El link cubre toda la tarjeta virtualmente */}
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          ${basePrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;