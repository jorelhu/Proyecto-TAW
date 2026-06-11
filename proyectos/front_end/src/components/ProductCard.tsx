// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { type Product } from '../types/';
import { useCartStore } from '../store/cartStore'; // 1. Importamos tu store

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const images = product.images || [];
  const variants = product.variants || [];

  // Acciones globales del carrito
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const primaryImageObj = images.find((img) => img.isPrimary) || images[0];
  const rawUrl = primaryImageObj?.url || primaryImageObj?.imageUrl;
  const imageUrl = rawUrl ? rawUrl : null;

  // Tomamos la primera variante disponible como predeterminada para el catálogo
  const defaultVariant = variants[0];
  const basePrice = Number(defaultVariant?.price) || 0;
  const hasStock = defaultVariant ? defaultVariant.stock > 0 : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    // 2. ¡CRÍTICO! Evita que el clic dispare la redirección del Link de la tarjeta
    e.preventDefault();
    e.stopPropagation();

    if (product && defaultVariant && hasStock) {
      addItem(product, defaultVariant);
      toggleCart(); // Opcional: abre el CartDrawer automáticamente para dar feedback premium
    }
  };

  return (
    // Removimos el "relative" de aquí para controlar mejor los clicks individuales
    <div className="group flex flex-col bg-white">
      {/* Contenedor de Imagen y Botón Flotante */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
              Sin imagen
            </div>
          )}
        </Link>

        {/* Botón Añadir — Con efecto hover premium */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20">
          <button
            onClick={handleAddToCart}
            disabled={!hasStock}
            className="flex w-full items-center justify-center space-x-2 bg-neutral-900/90 py-3 text-xs tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{hasStock ? 'Añadir' : 'Agotado'}</span>
          </button>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="mt-4 flex flex-col text-center">
        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium tracking-wide text-neutral-900">
          <Link to={`/product/${product.id}`} className="hover:underline">
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