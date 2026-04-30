// src/shared/components/CartTypes.ts

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
  addToCart: (product: Product) => void;
  total: number;
};