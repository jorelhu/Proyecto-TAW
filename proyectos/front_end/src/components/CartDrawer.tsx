// src/components/CartDrawer.tsx
import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

const CartDrawer: React.FC = () => {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, cartTotal } = useCartStore();
    const navigate = useNavigate();
    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay oscuro de fondo */}
            <div
                className="fixed inset-0 z-50 bg-emerald-900/40 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            />

            {/* Panel lateral */}
            <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-500 ease-in-out">
                {/* Cabecera del carrito */}
                <div className="flex items-center justify-between border-b border-emerald-100 px-6 py-6">
                    <h2 className="text-sm font-light tracking-[0.2em] text-emerald-900 uppercase">Tu Selección</h2>
                    <button onClick={toggleCart} className="text-emerald-500 hover:text-emerald-800 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Lista de Items */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center space-y-4 text-emerald-400">
                            <ShoppingBag className="h-12 w-12 stroke-1" />
                            <p className="text-xs tracking-widest uppercase">Tu bolsa está vacía</p>
                        </div>
                    ) : (
                        <ul className="space-y-8">
                            {items.map((item) => {
                                const primaryImage = item.product.images.find(img => img.isPrimary)?.imageUrl || item.product.images[0]?.imageUrl;

                                return (
                                    <li key={item.variant.id} className="flex space-x-6">
                                        <div className="h-28 w-20 flex-shrink-0 bg-emerald-50 overflow-hidden">
                                            <img src={primaryImage} alt={item.product.name} className="h-full w-full object-cover object-center" />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm tracking-wide text-emerald-900 uppercase">{item.product.name}</h3>
                                                    <p className="text-sm text-emerald-900">{(item.variant.price * item.quantity).toFixed(2)} Bs.</p>
                                                </div>
                                                <p className="mt-1 text-[10px] tracking-widest text-emerald-600 uppercase">{item.variant.size}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-emerald-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                                                        className="px-3 py-1 text-emerald-600 hover:text-emerald-900 transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="px-3 py-1 text-xs text-emerald-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                                                        className="px-3 py-1 text-emerald-600 hover:text-emerald-900 transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.variant.id)}
                                                    className="text-[10px] tracking-widest text-emerald-500 underline hover:text-emerald-800 uppercase transition-colors"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer del Carrito */}
                {items.length > 0 && (
                    <div className="border-t border-emerald-100 bg-emerald-50 px-6 py-8">
                        <div className="flex justify-between text-sm uppercase tracking-wide text-emerald-900 mb-6">
                            <span>Subtotal</span>
                            <span>{cartTotal().toFixed(2)} Bs.</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-emerald-800 py-4 text-xs tracking-[0.2em] text-white uppercase hover:bg-emerald-700 transition-colors"
                        >
                            Proceder al pago
                        </button>
                        <p className="mt-4 text-center text-[10px] tracking-widest text-emerald-600 uppercase">
                            Impuestos y envíos calculados en el checkout.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;