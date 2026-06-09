import axios from 'axios';

// Tipos para los datos del producto
export interface ProductData {
  name: string;
  brand: string;
  description: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  brand: string;
  description: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const productService = {
  // Crear producto con imágenes (usando FormData)
  createWithImages: async (formData: FormData): Promise<ProductResponse> => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Obtener todos los productos
  getAll: async (): Promise<ProductResponse[]> => {
    const response = await api.get('/products');
    return response.data;
  },
};