import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, ChevronLeft, Trash } from 'lucide-react';
import { api } from '../api/client';
import type { Product } from '../types';

interface VariantForm {
  id?: number;
  size: string;
  price: string;
  stock: string;
}

interface ImageItem {
  id?: number;
  file?: File;
  preview: string;
  isPrimary: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Estados para productos y UI
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Formulario principal
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
  });

  // Variantes e imágenes
  const [variants, setVariants] = useState<VariantForm[]>([
    { size: '100ml', price: '', stock: '' },
  ]);
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);

  // ========== HOOKS ==========
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<Product[]>('/products');
      setProducts(data);
    } catch (err) {
      console.error('Error al cargar inventario:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

useEffect(() => {
  if (!isAuthenticated || user?.role !== 'ADMIN') return;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchProducts();
}, [isAuthenticated, user, fetchProducts]);

  // ========== VALIDACIÓN DE AUTENTICACIÓN ==========
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // ========== RENDERIZADO CONDICIONAL ==========
  if (isLoading && products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  // ========== FORMULARIO DE CREACIÓN/EDICIÓN ==========
  if (isCreating) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Cabecera del formulario */}
        <div className="mb-12 flex flex-col justify-between border-b border-emerald-100 pb-8 sm:flex-row sm:items-end">
          <div>
            <h1 className="mb-2 text-3xl font-light tracking-[0.2em] uppercase text-emerald-900">
              {editingProduct ? 'Editar Fragancia' : 'Añadir Fragancia'}
            </h1>
            <p className="text-xs uppercase tracking-widest text-emerald-600">
              Ajuste de fórmula olfativa y catálogo
            </p>
          </div>
          <button
            onClick={() => {
              setIsCreating(false);
              setEditingProduct(null);
              setFormData({
                name: '',
                brand: '',
                description: '',
                topNotes: '',
                heartNotes: '',
                baseNotes: '',
              });
              setVariants([{ size: '100ml', price: '', stock: '' }]);
              setImageFiles([]);
            }}
            className="mt-6 flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors sm:mt-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Cancelar y Volver</span>
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (imageFiles.length === 0) {
              alert('Por favor agrega al menos una imagen visual para la fragancia.');
              return;
            }
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('topNotes', formData.topNotes);
            formDataToSend.append('heartNotes', formData.heartNotes);
            formDataToSend.append('baseNotes', formData.baseNotes);

            const compiledVariants = variants.map(v => ({
              ...(v.id && { id: v.id }),
              size: v.size || '100ml',
              price: parseFloat(v.price) || 0,
              stock: parseInt(v.stock) || 0,
            }));
            formDataToSend.append('variants', JSON.stringify(compiledVariants));

            const newFilesOnly = imageFiles.filter(img => img.file);
            const primaryIndex = imageFiles.findIndex(img => img.isPrimary);
            if (primaryIndex !== -1) {
              const primaryImage = imageFiles[primaryIndex];
              if (primaryImage.file) {
                const relativeIndex = newFilesOnly.indexOf(primaryImage);
                formDataToSend.append('primaryImageIndex', String(relativeIndex));
              } else {
                formDataToSend.append('primaryImageIndex', '-1');
              }
            }

            newFilesOnly.forEach((img) => {
              if (img.file) formDataToSend.append('files', img.file);
            });

            try {
              const axiosConfig = {
                headers: { 'Content-Type': 'multipart/form-data' },
              };
              if (editingProduct) {
                await api.patch(`/products/${editingProduct.id}`, formDataToSend, axiosConfig);
                alert('Catálogo de la fragancia modificado exitosamente.');
              } else {
                await api.post('/products', formDataToSend, axiosConfig);
                alert('Nueva fragancia registrada con éxito.');
              }
              setIsCreating(false);
              setEditingProduct(null);
              fetchProducts();
            } catch (err) {
              console.error('Error al procesar el formulario:', err);
              alert('Ocurrió un problema al guardar los cambios en el servidor.');
            }
          }}
          className="max-w-3xl animate-fadeIn space-y-10"
        >
          {/* Datos core */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Nombre de la Fragancia</label>
              <input
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Colección / Marca</label>
              <input
                type="text" required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Variantes */}
          <div className="border-t border-emerald-100 pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Presentaciones y Tamaños (Variantes)</label>
              <button
                type="button"
                onClick={() => setVariants([...variants, { size: '', price: '', stock: '' }])}
                className="flex items-center space-x-1 border border-emerald-800 px-3 py-1.5 text-[10px] uppercase tracking-widest text-emerald-800 hover:bg-emerald-800 hover:text-white transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Añadir Tamaño</span>
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex flex-col items-center gap-4 bg-emerald-50/40 p-4 sm:flex-row border border-emerald-50">
                  <div className="w-full sm:w-1/3">
                    <input
                      type="text" required
                      placeholder="Tamaño (Ej. 100ml, 50ml)"
                      value={variant.size}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[index].size = e.target.value;
                        setVariants(updated);
                      }}
                      className="w-full border-b border-emerald-200 bg-transparent py-2 text-xs font-light focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <input
                      type="number" required min="0" step="0.01"
                      placeholder="Precio (Bs.)"
                      value={variant.price}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[index].price = e.target.value;
                        setVariants(updated);
                      }}
                      className="w-full border-b border-emerald-200 bg-transparent py-2 text-xs font-light focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <input
                      type="number" required min="0"
                      placeholder="Stock Unidades"
                      value={variant.stock}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[index].stock = e.target.value;
                        setVariants(updated);
                      }}
                      className="w-full border-b border-emerald-200 bg-transparent py-2 text-xs font-light focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (variants.length === 1) {
                        alert('Una fragancia debe contener al menos una variante de presentación.');
                        return;
                      }
                      setVariants(variants.filter((_, i) => i !== index));
                    }}
                    className="text-emerald-500 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash className="h-4 w-4 stroke-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="grid grid-cols-1 gap-8 border-t border-emerald-100 pt-8 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Notas de Salida</label>
              <input
                type="text"
                value={formData.topNotes}
                onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Notas de Corazón</label>
              <input
                type="text"
                value={formData.heartNotes}
                onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Notas de Fondo</label>
              <input
                type="text"
                value={formData.baseNotes}
                onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2 border-t border-emerald-100 pt-8">
            <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Historia / Descripción</label>
            <textarea
              required rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none resize-none"
            />
          </div>

          {/* Galería */}
          <div className="space-y-4 border-t border-emerald-100 pt-8">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-emerald-800">Galería de Imágenes Visuales</label>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center border border-dashed border-emerald-300 bg-emerald-50/30 transition-colors hover:border-emerald-600">
                <input type="file" multiple accept="image/*" onChange={(e) => {
                  if (e.target.files) {
                    const currentHasPrimary = imageFiles.some(img => img.isPrimary);
                    const filesArray = Array.from(e.target.files).map((file, idx) => ({
                      file,
                      preview: URL.createObjectURL(file),
                      isPrimary: !currentHasPrimary && idx === 0,
                    }));
                    setImageFiles([...imageFiles, ...filesArray]);
                  }
                }} className="absolute inset-0 z-10 cursor-pointer opacity-0" />
                <Plus className="mb-2 h-6 w-6 stroke-1 text-emerald-500 transition-colors group-hover:text-emerald-700" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 transition-colors group-hover:text-emerald-700">Añadir Imagen</span>
              </div>

              {imageFiles.map((img, idx) => (
                <div key={idx} className="group relative aspect-[3/4] overflow-hidden bg-emerald-50 border border-emerald-100">
                  <img src={img.preview} alt="Preview" className="h-full w-full object-cover object-center" />
                  <div className="absolute inset-0 flex flex-col justify-between bg-emerald-950/40 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        const target = imageFiles[idx];
                        if (target.id && !confirm('¿Deseas remover permanentemente esta imagen del servidor?')) return;
                        if (target.id) {
                          api.delete(`/product-images/${target.id}`).catch(console.error);
                        }
                        const filtered = imageFiles.filter((_, i) => i !== idx);
                        if (target.isPrimary && filtered.length > 0) {
                          filtered[0].isPrimary = true;
                          if (editingProduct && filtered[0].id) {
                            api.patch(`/product-images/${filtered[0].id}`, { isPrimary: true }).catch(console.error);
                          }
                        }
                        setImageFiles(filtered);
                      }}
                      className="self-end bg-red-600/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-red-600"
                    >
                      Remover
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const targetImage = imageFiles[idx];
                        if (editingProduct && targetImage.id) {
                          await api.patch(`/product-images/${targetImage.id}`, { isPrimary: true });
                        }
                        setImageFiles(imageFiles.map((img, i) => ({ ...img, isPrimary: i === idx })));
                      }}
                      className={`w-full py-2 text-center text-[9px] uppercase tracking-widest transition-colors ${img.isPrimary ? 'bg-white font-medium text-emerald-950' : 'bg-emerald-900/80 text-white hover:bg-white hover:text-emerald-950'}`}
                    >
                      {img.isPrimary ? 'Portada Principal' : 'Definir Portada'}
                    </button>
                  </div>
                  {img.isPrimary && (
                    <span className="absolute left-2 top-2 bg-emerald-800 px-2 py-0.5 text-[8px] uppercase tracking-widest text-white">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button type="submit" className="bg-emerald-800 px-10 py-4 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-emerald-700">
              {editingProduct ? 'Actualizar Cambios' : 'Guardar Fragancia'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ========== DASHBOARD PRINCIPAL (SOLO TABLA DE PRODUCTOS) ==========
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Cabecera */}
        <div className="mb-12 flex flex-col justify-between border-b border-emerald-100 pb-8 sm:flex-row sm:items-end">
  <div>
    <h1 className="mb-2 text-3xl font-light tracking-[0.2em] uppercase text-emerald-900">Panel de Control</h1>
    <p className="text-xs uppercase tracking-widest text-emerald-600">Gestión de Inventario y Colecciones</p>
  </div>
    <div className="mt-6 flex gap-4 sm:mt-0">
        <Link
        to="/admin/stats"
        className="flex items-center space-x-2 border border-emerald-800 px-6 py-3 text-xs uppercase tracking-widest text-emerald-800 hover:bg-emerald-800 hover:text-white transition-colors"
        >
        <span>Ver Gráficos</span>
        </Link>
        <button
        onClick={() => setIsCreating(true)}
        className="flex items-center space-x-2 bg-emerald-800 px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-emerald-700 transition-colors"
        >
        <Plus className="h-4 w-4" />
        <span>Nuevo Perfume</span>
        </button>
    </div>
    </div>

        {/* Tabla de productos */}
        {products.length === 0 ? (
          <div className="flex h-64 items-center justify-center border border-dashed border-emerald-200">
            <span className="text-xs uppercase tracking-widest text-emerald-500">No hay fragancias registradas en el catálogo del servidor.</span>
          </div>
        ) : (
          <div className="animate-fadeIn overflow-x-auto">
            <table className="w-full text-left text-sm font-light text-emerald-700">
              <thead className="border-b border-emerald-200 bg-emerald-50 text-[10px] uppercase tracking-widest text-emerald-900">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Fragancia</th>
                  <th className="px-6 py-4">Línea</th>
                  <th className="px-6 py-4">Precio Base</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const basePrice = Number(product.variants?.[0]?.price) || 0;
                  const totalStock = (product.variants || []).reduce((acc, curr) => acc + curr.stock, 0);
                  return (
                    <tr key={product.id} className="border-b border-emerald-100 transition-colors hover:bg-emerald-50/30">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-900">#{product.id}</td>
                      <td className="px-6 py-4 text-emerald-900">{product.name}</td>
                      <td className="px-6 py-4 text-[10px] uppercase tracking-widest text-emerald-500">{product.brand}</td>
                      <td className="px-6 py-4">
                        {basePrice.toFixed(2)} Bs.
                        {basePrice === 0 && <br />}
                        {basePrice === 0 && <span className="text-red-500">(sin precio)</span>}
                        </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest ${totalStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {totalStock > 0 ? `${totalStock} u.` : 'Agotado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setFormData({
                                name: product.name,
                                brand: product.brand,
                                description: product.description || '',
                                topNotes: product.topNotes || '',
                                heartNotes: product.heartNotes || '',
                                baseNotes: product.baseNotes || '',
                              });
                              if (product.variants?.length) {
                                setVariants(product.variants.map(v => ({
                                  id: v.id,
                                  size: v.size,
                                  price: String(v.price),
                                  stock: String(v.stock),
                                })));
                              } else {
                                setVariants([{ size: '100ml', price: '', stock: '' }]);
                              }
                              if (product.images) {
                                setImageFiles(product.images.map(img => ({
                                  id: img.id,
                                  preview: img.imageUrl,
                                  isPrimary: img.isPrimary,
                                })));
                              } else {
                                setImageFiles([]);
                              }
                              setIsCreating(true);
                            }}
                            className="text-emerald-400 transition-colors hover:text-emerald-800"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('¿Estás seguro de que deseas eliminar permanentemente esta fragancia del catálogo?')) {
                                try {
                                  await api.delete(`/products/${product.id}`);
                                  setProducts(products.filter(p => p.id !== product.id));
                                } catch (err) {
                                  console.error('Error al eliminar producto:', err);
                                  alert('No se pudo eliminar el producto del servidor.');
                                }
                              }
                            }}
                            className="text-emerald-400 transition-colors hover:text-red-600"
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
    </div>
  );
};

export default AdminDashboard;