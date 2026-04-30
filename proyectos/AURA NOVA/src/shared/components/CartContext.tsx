import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CartItem = {
  id: number;
  name: string;
  brand?: string;
  price: number;
  image: string;
  quantity: number;
  size?: string; // Para soportar la variante elegida
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  total: number;
};

const CartContext = createContext({} as CartContextType);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Inicialización perezosa leyendo de localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("auranova_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem("auranova_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart(prev => {
      // Comparamos id y también el tamaño (si existe) para no mezclar un 50ml con un 100ml
      const existing = prev.find(item => item.id === product.id && item.size === product.size);

      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }

      return [...prev, product];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    // Evitamos que la cantidad sea 0 o negativa desde el input
    if (quantity < 1) return; 

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);