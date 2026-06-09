// src/pages/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import type { Product, ProductVariant } from '../types';
import { useCartStore } from '../store/cartStore';
import { api } from '../api/client'; // Importamos tu cliente Axios configurado

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    // Petición real a la API de NestJS
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setIsLoading(true);
                // Llamamos al endpoint /products/:id
                const { data } = await api.get<Product>(`/products/${id}`);

                setProduct(data);

                // Si el producto tiene variantes, seleccionamos la primera por defecto
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (error) {
                console.error('Error al cargar la fragancia:', error);
                setProduct(null); // Aseguramos que el estado sea null para mostrar la vista de error
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <span className="text-xs tracking-widest text-neutral-400 uppercase animate-pulse">
                    Descifrando esencia...
                </span>
            </div>
        );
    }

    if (!product || !selectedVariant) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-fadeIn">
                <p className="text-sm tracking-widest text-neutral-500 uppercase mb-4">Fragancia no encontrada</p>
                <Link to="/shop" className="text-xs underline tracking-widest text-neutral-900">Volver a la colección</Link>
            </div>
        );
    }

    // Buscamos la imagen principal o usamos la primera disponible de forma segura
    const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || 'https://via.placeholder.com/600x800?text=AURA+NOVA';

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Botón de regreso */}
            <Link to="/shop" className="inline-flex items-center space-x-2 text-xs tracking-widest text-neutral-500 hover:text-neutral-900 uppercase transition-colors mb-12">
                <ChevronLeft className="h-4 w-4" />
                <span>Volver al catálogo</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Columna Izquierda: Imagen */}
                <div className="aspect-[4/5] bg-neutral-100 overflow-hidden sticky top-28">
                    <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Columna Derecha: Detalles */}
                <div className="flex flex-col">
                    <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">
                        {product.brand}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-light tracking-[0.1em] text-neutral-900 uppercase mb-4">
                        {product.name}
                    </h1>
                    <p className="text-xl font-light text-neutral-600 mb-8">
                        {Number(selectedVariant.price).toFixed(2)} Bs.
                    </p>

                    <p className="text-sm font-light leading-relaxed tracking-wide text-neutral-600 mb-10">
                        {product.description}
                    </p>

                    {/* Pirámide Olfativa */}
                    <div className="border-t border-b border-neutral-200 py-6 mb-10 space-y-4">
                        <h3 className="text-xs font-medium tracking-widest text-neutral-900 uppercase mb-4">Pirámide Olfativa</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-light">
                            <div>
                                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Salida</span>
                                <span className="text-neutral-700">{product.topNotes || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Corazón</span>
                                <span className="text-neutral-700">{product.heartNotes || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Fondo</span>
                                <span className="text-neutral-700">{product.baseNotes || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Selector de Tamaño */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-medium tracking-widest text-neutral-900 uppercase">Tamaño</span>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-6 py-3 text-xs tracking-widest uppercase transition-all duration-200 ${selectedVariant.id === variant.id
                                            ? 'border-2 border-neutral-900 bg-neutral-900 text-white'
                                            : 'border border-neutral-300 text-neutral-600 hover:border-neutral-900'
                                            }`}
                                    >
                                        {variant.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => addItem(product, selectedVariant)}
                        disabled={selectedVariant.stock <= 0}
                        className="flex w-full items-center justify-center space-x-3 bg-neutral-900 py-5 text-sm tracking-[0.2em] text-white uppercase transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        <span>
                            {selectedVariant.stock > 0
                                ? `Añadir al carrito — ${Number(selectedVariant.price).toFixed(2)} Bs.`
                                : 'Agotado'}
                        </span>
                    </button>

                    {/* Información extra de envío */}
                    <div className="mt-6 text-center">
                        <span className="text-[10px] tracking-widest text-neutral-400 uppercase">Envío de encomienda a coordinar</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;