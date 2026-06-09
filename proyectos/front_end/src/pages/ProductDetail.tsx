// src/pages/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import type { Product, ProductVariant } from '../types';
import { useCartStore } from '../store/cartStore';
import { api } from '../api/client';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get<Product>(`/products/${id}`);
                setProduct(data);
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (error) {
                console.error('Error al cargar la fragancia:', error);
                setProduct(null);
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
                <span className="text-xs tracking-widest text-emerald-400 uppercase animate-pulse">
                    Descifrando esencia...
                </span>
            </div>
        );
    }

    if (!product || !selectedVariant) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-fadeIn">
                <p className="mb-4 text-sm tracking-widest text-emerald-500 uppercase">Fragancia no encontrada</p>
                <Link to="/shop" className="text-xs uppercase tracking-widest text-emerald-700 underline hover:text-emerald-900">
                    Volver a la colección
                </Link>
            </div>
        );
    }

    const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || 'https://via.placeholder.com/600x800?text=AURA+NOVA';

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <Link to="/shop" className="mb-12 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-500 transition-colors hover:text-emerald-700">
                <ChevronLeft className="h-4 w-4" />
                <span>Volver al catálogo</span>
            </Link>

            <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
                {/* Columna Izquierda: Imagen */}
                <div className="sticky top-28 aspect-[4/5] overflow-hidden bg-emerald-50">
                    <img
                        src={primaryImage}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                {/* Columna Derecha: Detalles */}
                <div className="flex flex-col">
                    <span className="mb-2 text-xs tracking-[0.3em] uppercase text-emerald-500">
                        {product.brand}
                    </span>
                    <h1 className="mb-4 text-4xl font-light tracking-[0.1em] text-emerald-900 uppercase sm:text-5xl">
                        {product.name}
                    </h1>
                    <p className="mb-8 text-xl font-light text-emerald-700">
                        {Number(selectedVariant.price).toFixed(2)} Bs.
                    </p>

                    <p className="mb-10 text-sm font-light leading-relaxed tracking-wide text-emerald-700">
                        {product.description}
                    </p>

                    {/* Pirámide Olfativa */}
                    <div className="mb-10 space-y-4 border-t border-b border-emerald-100 py-6">
                        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-emerald-800">Pirámide Olfativa</h3>
                        <div className="grid grid-cols-1 gap-4 text-sm font-light sm:grid-cols-3">
                            <div>
                                <span className="mb-1 block text-[10px] uppercase tracking-widest text-emerald-500">Salida</span>
                                <span className="text-emerald-800">{product.topNotes || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="mb-1 block text-[10px] uppercase tracking-widest text-emerald-500">Corazón</span>
                                <span className="text-emerald-800">{product.heartNotes || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="mb-1 block text-[10px] uppercase tracking-widest text-emerald-500">Fondo</span>
                                <span className="text-emerald-800">{product.baseNotes || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Selector de Tamaño */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-10">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-widest text-emerald-800">Tamaño</span>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-6 py-3 text-xs uppercase tracking-widest transition-all duration-200 ${
                                            selectedVariant.id === variant.id
                                                ? 'border-2 border-emerald-800 bg-emerald-800 text-white'
                                                : 'border border-emerald-200 text-emerald-600 hover:border-emerald-600'
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
                        className="flex w-full items-center justify-center space-x-3 bg-emerald-800 py-5 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        <span>
                            {selectedVariant.stock > 0
                                ? `Añadir al carrito — ${Number(selectedVariant.price).toFixed(2)} Bs.`
                                : 'Agotado'}
                        </span>
                    </button>

                    <div className="mt-6 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-emerald-400">Envío de encomienda a coordinar</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;