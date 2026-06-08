// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariant } from '../types';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toggleCart: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, variant, quantity = 1) => set((state) => {
        const existingItem = state.items.find((item) => item.variant.id === variant.id);
        
        if (existingItem) {
          // Si la variante ya está en el carrito, sumamos la cantidad
          return {
            items: state.items.map((item) =>
              item.variant.id === variant.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true, // Abrimos el carrito automáticamente al añadir
          };
        }
        
        // Si es un producto nuevo, lo añadimos al arreglo
        return { 
          items: [...state.items, { product, variant, quantity }],
          isOpen: true,
        };
      }),

      removeItem: (variantId) => set((state) => ({
        items: state.items.filter((item) => item.variant.id !== variantId),
      })),

      updateQuantity: (variantId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.variant.id === variantId ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      cartTotal: () => {
        return get().items.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
      },

      cartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'auranova-cart-storage', // Nombre clave para el localStorage
    }
  )
);