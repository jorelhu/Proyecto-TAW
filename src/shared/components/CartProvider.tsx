import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart([
      ...cart,
      {
        ...product,
        quantity,
      },
    ]);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export { CartContext };