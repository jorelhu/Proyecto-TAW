// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import { api } from '../api/client'; // Tu cliente Axios configurada
import type { Product } from '../types';


const AdminDashboard: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageFiles, setImageFiles] = useState<{ file?: File; preview: string; isPrimary: boolean }[]>([]);

    // Estados para navegación y control de edición
    const [isCreating, setIsCreating] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Estado unificado para el formulario (Sirve para Crear y Editar)
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

    // 1. Cargar productos reales desde el Backend
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
}, []); // Vacío porque no depende de variables externas que cambien

    useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
        // eslint-disable-next-line
        fetchProducts();
    }
}, [isAuthenticated, user, fetchProducts]); // Añadimos fetchProducts a las dependencias

    // Protección Extrema de Ruta
    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    // 2. Preparar el formulario para EDICIÓN
    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        const baseVariant = product.variants?.[0];
        
        setFormData({
            name: product.name,
            brand: product.brand,
            description: product.description || '',
            topNotes: product.topNotes || '',
            heartNotes: product.heartNotes || '',
            baseNotes: product.baseNotes || '',
            price: baseVariant ? String(baseVariant.price) : '',
            stock: baseVariant ? String(baseVariant.stock) : '',
        });

        // Mapeamos las imágenes que ya existen en el backend a la vista previa
        if (product.images) {
            setImageFiles(
                product.images.map(img => ({
                    preview: img.imageUrl,
                    isPrimary: img.isPrimary
                }))
            );
        } else {
            setImageFiles([]);
        }

        setIsCreating(true); // Abrimos el formulario
    };

    // 3. Manejador unificado de Envío (CREATE o UPDATE)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Creamos el contenedor especial para enviar archivos y texto mezclado
        const formDataToSend = new FormData();

        // 2. Añadimos los datos de texto
        formDataToSend.append('name', formData.name);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('topNotes', formData.topNotes);
        formDataToSend.append('heartNotes', formData.heartNotes);
        formDataToSend.append('baseNotes', formData.baseNotes);

        // 3. Las variantes deben ir como un string (tu NestJS ya tiene JSON.parse para esto)
        const variantsArray = [{
            ...(editingProduct?.variants?.[0] && { id: editingProduct.variants[0].id }),
            size: '50ml',
            price: parseFloat(formData.price) || 0,
            stock: parseInt(formData.stock) || 0,
        }];
        formDataToSend.append('variants', JSON.stringify(variantsArray));

        // 4. Encontrar qué índice tiene la imagen principal para decírselo al backend
        const primaryIndex = imageFiles.findIndex(img => img.isPrimary);
        if (primaryIndex !== -1) {
            formDataToSend.append('primaryImageIndex', String(primaryIndex));
        }

        // 5. LO MÁS IMPORTANTE: Adjuntar los archivos binarios reales
        imageFiles.forEach((img) => {
            if (img.file) {
                // 'files' es el nombre exacto que espera NestJS en FilesInterceptor('files')
                formDataToSend.append('files', img.file); 
            }
        });

        try {
            // 6. Configurar Axios para que sepa que está enviando archivos
            const axiosConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (editingProduct) {
                // Modo Edición: PATCH /products/:id
                await api.patch(`/products/${editingProduct.id}`, formDataToSend, axiosConfig);
                alert('Fragancia actualizada con éxito.');
            } else {
                // Modo Creación: POST /products
                await api.post('/products', formDataToSend, axiosConfig);
                alert('Nueva fragancia registrada en el catálogo.');
            }

            // Resetear estados y refrescar lista
            resetForm();
            fetchProducts();
        } catch (err) {
            console.error('Error al procesar el formulario:', err);
            alert('Ocurrió un problema al guardar los cambios en el servidor.');
        }
    };

    // 4. Eliminar Producto Real de la BD
    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente esta fragancia del catálogo?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(product => product.id !== id));
            } catch (err) {
                console.error('Error al eliminar producto:', err);
                alert('No se pudo eliminar el producto del servidor.');
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', brand: '', description: '', topNotes: '', heartNotes: '', baseNotes: '', price: '', stock: '' });
        setImageFiles([]);
        setIsCreating(false);
        setEditingProduct(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                isPrimary: imageFiles.length === 0
            }));
            setImageFiles([...imageFiles, ...filesArray]);
        }
    };

    const togglePrimaryImage = (indexToSet: number) => {
        setImageFiles(
            imageFiles.map((img, idx) => ({
                ...img,
                isPrimary: idx === indexToSet
            }))
        );
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-neutral-900 mb-2">
                        {isCreating ? (editingProduct ? 'Editar Fragancia' : 'Añadir Fragancia') : 'Panel de Control'}
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                        {isCreating ? 'Ajuste de fórmula olfativa y catálogo' : 'Gestión de Inventario y Colecciones'}
                    </p>
                </div>

                {isCreating ? (
                    <button
                        onClick={resetForm}
                        className="mt-6 flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors sm:mt-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Cancelar y Volver</span>
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

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="text-xs uppercase tracking-widest text-neutral-400 animate-pulse">Sincronizando inventario con el servidor...</span>
                </div>
            ) : isCreating ? (
                <form onSubmit={handleSubmit} className="max-w-3xl animate-fadeIn space-y-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {/* Nombre y Marca */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Nombre de la Fragancia</label>
                            <input
                                type="text" required
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej. Midnight Saffron"
                                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Colección / Marca</label>
                            <input
                                type="text" required
                                value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="Ej. AURA NOVA Privé"
                                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
                            />
                        </div>

                        {/* Precio y Stock base */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Precio Base (Bs.)</label>
                            <input
                                type="number" min="0" step="0.01" required
                                value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Stock Inicial (Unidades)</label>
                            <input
                                type="number" min="0" required
                                value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                                value={formData.topNotes} onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                                placeholder="Ej. Bergamota, Limón"
                                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Notas de Corazón</label>
                            <input
                                type="text"
                                value={formData.heartNotes} onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                                placeholder="Ej. Jazmín, Rosa"
                                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900">Notas de Fondo</label>
                            <input
                                type="text"
                                value={formData.baseNotes} onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
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
                            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe las emociones y sensaciones de la fragancia..."
                            className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-neutral-900 focus:outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* Galería */}
                    <div className="space-y-4 border-t border-neutral-100 pt-8">
                        <label className="text-[10px] font-medium uppercase tracking-widest text-neutral-900 block">Galería de Imágenes Visuales</label>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                            <div className="relative aspect-[3/4] border border-dashed border-neutral-300 hover:border-neutral-900 transition-colors flex flex-col items-center justify-center group cursor-pointer bg-neutral-50/50">
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <Plus className="h-6 w-6 text-neutral-400 group-hover:text-neutral-900 transition-colors stroke-1 mb-2" />
                                <span className="text-[10px] uppercase tracking-widest text-neutral-400 group-hover:text-neutral-900 transition-colors">Añadir Imagen</span>
                            </div>

                            {imageFiles.map((img, index) => (
                                <div key={index} className="relative aspect-[3/4] bg-neutral-100 group overflow-hidden">
                                    <img src={img.preview} alt="Preview" className="h-full w-full object-cover object-center" />
                                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                        <button
                                            type="button"
                                            onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))}
                                            className="self-end text-[10px] uppercase tracking-widest text-white bg-red-600/80 px-2 py-1 hover:bg-red-600 transition-colors"
                                        >Remover</button>
                                        <button
                                            type="button"
                                            onClick={() => togglePrimaryImage(index)}
                                            className={`w-full py-2 text-[9px] uppercase tracking-widest text-center transition-colors ${img.isPrimary ? 'bg-white text-neutral-950 font-medium' : 'bg-neutral-900/80 text-white hover:bg-white hover:text-neutral-950'}`}
                                        >
                                            {img.isPrimary ? 'Portada Principal' : 'Definir Portada'}
                                        </button>
                                    </div>
                                    {img.isPrimary && <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[8px] uppercase tracking-widest px-2 py-0.5">Principal</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-8">
                        <button type="submit" className="bg-neutral-900 px-10 py-4 text-xs uppercase tracking-[0.2em] text-white hover:bg-neutral-800 transition-colors">
                            {editingProduct ? 'Actualizar Cambios' : 'Guardar Fragancia'}
                        </button>
                    </div>
                </form>
            ) : products.length === 0 ? (
                <div className="flex justify-center items-center h-64 border border-dashed border-neutral-200">
                    <span className="text-xs uppercase tracking-widest text-neutral-400">No hay fragancias registradas en el catálogo del servidor.</span>
                </div>
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
                                // PROTECCIÓN CONTRA EL DETALLE DECIMAL DE MYSQL (FIX TRASLADADO AQUÍ)
                                const basePrice = Number(product.variants?.[0]?.price) || 0;
                                const totalStock = (product.variants || []).reduce((acc, curr) => acc + curr.stock, 0);

                                return (
                                    <tr key={product.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900">#{product.id}</td>
                                        <td className="px-6 py-4 text-neutral-900">{product.name}</td>
                                        <td className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-400">{product.brand}</td>
                                        <td className="px-6 py-4">{basePrice.toFixed(2)} Bs.</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest ${totalStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {totalStock > 0 ? `${totalStock} u.` : 'Agotado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button 
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-neutral-400 hover:text-neutral-900 transition-colors" 
                                                    title="Editar"
                                                >
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