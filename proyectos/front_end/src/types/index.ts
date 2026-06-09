// src/types/index.ts

export interface ProductVariant {
  id: number;
  productId: number;
  size: string;
  price: number;
  stock: number;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}
export interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: {
    quantity: number;
    price: number;
    variant: {
      size: string;
      product: { name: string; imageUrl: string };
    };
  }[];
}