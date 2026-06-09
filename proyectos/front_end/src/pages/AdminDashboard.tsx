// src/pages/AdminDashboard.tsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import type { Product } from '../types';

// Datos de prueba iniciales
const mockInventory: Product[] = [
  {
    id: 1,
    name: 'Mystic Oud',
    brand: 'AURA NOVA Privé',
    description: 'Una fragancia magnética y profunda...',
    variants: [{ id: 1, productId: 1, size: '50ml', price: 120.00, stock: 15 }],
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Soleil Blanc',
    brand: 'AURA NOVA Fresh',
    description: 'Un escape solar encapsulado...',
    variants: [{ id: 3, productId: 2, size: '50ml', price: 95.00, stock: 0 }],
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>(mockInventory);
  
  // Estado para alternar entre la tabla y el formulario
  const [isCreating, setIsCreating] = useState(false);

  // Estado para los datos del nuevo perfume
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    price: '',
    stock: '',
  });

  // Protección Extrema
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Manejador del envío del formulario
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Creamos un nuevo objeto de producto simulando el ID autoincremental
    const newProduct: Product = {
      id: Date.now(), // ID temporal basado en la fecha
      name: formData.name,
      brand: formData.brand,
      description: formData.description,
      topNotes: formData.topNotes,
      heartNotes: formData.heartNotes,
      baseNotes: formData.baseNotes,
      // Creamos una variante base automática para el precio y stock
      variants: [{
        id: Date.now() + 1,
        productId: Date.now(),
        size: '50ml',
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
      }],
      images: [], // Sin imagen por ahora
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Añadimos el producto al inicio de la lista
    setProducts([newProduct, ...products]);
    
    // Limpiamos el formulario y volvemos a la tabla
    setFormData({ name: '', brand: '', description: '', topNotes: '', heartNotes: '', baseNotes: '', price: '', stock: '' });
    setIsCreating(false);
  };

  // Función para eliminar un producto (bonus track)
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta fragancia del catálogo?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Cabecera dinámica dependiendo de si estamos creando o no */}
      <div className="mb-12 flex flex-col justify-between border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-neutral-900 mb-2">
            {isCreating ? 'Añadir Fragancia' : 'Panel de Control'}
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            {isCreating ? 'Registro de nueva fórmula olfativa' : 'Gestión de Inventario y Colecciones'}
          </p>
        </div>
        
        {isCreating ? (
          <button 
            onClick={() => setIsCreating(false)}
            className="mt-6 flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors sm:mt-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver al inventario</span>
          </button>
        ) : (
          <button 
            onClick={() => setIsCreating(true)}
            className="mt-6 flex items-center space-x-2 bg-neutral-900 px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors sm:mt-0"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Perfume</span>
          </button>
        )}
      </div>

      {/* Renderizado Condicional: Formulario o Tabla */}
      {isCreating ? (
        <form onSubmit={handleCreateSubmit} className="max-w-3xl animate-fadeIn space-y-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Nombre y Marca */}
            <div className="space-y-4">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Nombre de la Fragancia</label>
              <input 
                type="text" required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ej. Midnight Saffron" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Colección / Marca</label>
              <input 
                type="text" required
                value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="Ej. AURA NOVA Privé" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {/* Precio y Stock base */}
            <div className="space-y-4">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Precio Base ($)</label>
              <input 
                type="number" min="0" step="0.01" required
                value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Stock Inicial (Unidades)</label>
              <input 
                type="number" min="0" required
                value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="0" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Pirámide Olfativa */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 border-t border-neutral-100 pt-8">
            <div className="space-y-4">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Notas de Salida</label>
              <input 
                type="text" 
                value={formData.topNotes} onChange={(e) => setFormData({...formData, topNotes: e.target.value})}
                placeholder="Ej. Bergamota, Limón" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Notas de Corazón</label>
              <input 
                type="text" 
                value={formData.heartNotes} onChange={(e) => setFormData({...formData, heartNotes: e.target.value})}
                placeholder="Ej. Jazmín, Rosa" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Notas de Fondo</label>
              <input 
                type="text" 
                value={formData.baseNotes} onChange={(e) => setFormData({...formData, baseNotes: e.target.value})}
                placeholder="Ej. Vainilla, Ámbar" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-4 border-t border-neutral-100 pt-8">
            <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Historia / Descripción</label>
            <textarea 
              required rows={4}
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe las emociones y sensaciones de la fragancia..." 
              className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end pt-8">
            <button 
              type="submit"
              className="bg-neutral-900 px-10 py-4 text-xs uppercase tracking-[0.2em] text-white hover:bg-neutral-800 transition-colors"
            >
              Guardar Fragancia
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto animate-fadeIn">
          <table className="w-full text-left text-sm font-light text-neutral-600">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-widest text-neutral-900">
              <tr>
                <th scope="col" className="px-6 py-4">ID</th>
                <th scope="col" className="px-6 py-4">Fragancia</th>
                <th scope="col" className="px-6 py-4">Línea</th>
                <th scope="col" className="px-6 py-4">Precio Base</th>
                <th scope="col" className="px-6 py-4">Stock</th>
                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const basePrice = product.variants[0]?.price || 0;
                const totalStock = product.variants.reduce((acc, curr) => acc + curr.stock, 0);

                return (
                  <tr key={product.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900">#{product.id}</td>
                    <td className="px-6 py-4 text-neutral-900">{product.name}</td>
                    <td className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-400">{product.brand}</td>
                    <td className="px-6 py-4">${basePrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest ${totalStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {totalStock > 0 ? `${totalStock} u.` : 'Agotado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-3">
                        <button className="text-neutral-400 hover:text-neutral-900 transition-colors" title="Editar">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors" 
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;