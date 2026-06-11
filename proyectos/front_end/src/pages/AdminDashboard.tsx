import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
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
    id?: number;      // Presente si la imagen ya existe en la Base de Datos
    file?: File;      // Presente si es una nueva imagen subida en esta sesión
    preview: string;  // ObjectURL local o URL remota de la BD
    isPrimary: boolean;
}

const AdminDashboard: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estado unificado para imágenes del producto
    const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);

    const [isCreating, setIsCreating] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Formulario de datos core de la fragancia
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        topNotes: '',
        heartNotes: '',
        baseNotes: '',
    });

    // Estado dinámico para manejar un arreglo de variantes reales
    const [variants, setVariants] = useState<VariantForm[]>([
        { size: '100ml', price: '', stock: '' } // Variante por defecto
    ]);

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

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    // Carga de producto para edición
    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        
        setFormData({
            name: product.name,
            brand: product.brand,
            description: product.description || '',
            topNotes: product.topNotes || '',
            heartNotes: product.heartNotes || '',
            baseNotes: product.baseNotes || '',
        });

        // Mapear variantes existentes del producto
        if (product.variants && product.variants.length > 0) {
            setVariants(
                product.variants.map(v => ({
                    id: v.id,
                    size: v.size,
                    price: String(v.price),
                    stock: String(v.stock)
                }))
            );
        } else {
            setVariants([{ size: '100ml', price: '', stock: '' }]);
        }

        // Mapear imágenes de la DB guardando su ID para rastrear la portada
        if (product.images) {
            setImageFiles(
                product.images.map(img => ({
                    id: img.id,
                    preview: img.imageUrl,
                    isPrimary: img.isPrimary
                }))
            );
        } else {
            setImageFiles([]);
        }

        setIsCreating(true);
    };

    // Funciones para manipular el estado dinámico de las variantes
    const handleVariantChange = (index: number, field: keyof VariantForm, value: string) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };
        setVariants(updated);
    };

    const addVariantRow = () => {
        setVariants([...variants, { size: '', price: '', stock: '' }]);
    };

    const removeVariantRow = (index: number) => {
        if (variants.length === 1) {
            alert('Una fragancia debe contener al menos una variante de presentación.');
            return;
        }
        setVariants(variants.filter((_, i) => i !== index));
    };

    // Controlador para alternar cuál imagen será la Portada Principal
    const togglePrimaryImage = async (indexToSet: number) => {
        const targetImage = imageFiles[indexToSet];

        // Reparación de Bug: Si la imagen ya tiene ID persistido en la BD, notificamos al backend de inmediato
        if (editingProduct && targetImage.id) {
            try {
                await api.patch(`/product-images/${targetImage.id}`, { isPrimary: true });
            } catch (err) {
                console.error("Error al sincronizar cambio de portada en servidor:", err);
            }
        }

        // Sincronizar estado local visual de inmediato
        setImageFiles(
            imageFiles.map((img, idx) => ({
                ...img,
                isPrimary: idx === indexToSet
            }))
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const currentHasPrimary = imageFiles.some(img => img.isPrimary);
            const filesArray = Array.from(e.target.files).map((file, idx) => ({
                file,
                preview: URL.createObjectURL(file),
                // Si la galería estaba vacía y es el primer archivo procesado, marcarlo como default
                isPrimary: !currentHasPrimary && idx === 0
            }));
            setImageFiles([...imageFiles, ...filesArray]);
        }
    };

    const handleRemoveImage = async (indexToRemove: number) => {
        const target = imageFiles[indexToRemove];
        
        // Si ya existía en la BD, ejecutar petición DELETE en backend
        if (target.id) {
            if (!window.confirm('¿Deseas remover permanentemente esta imagen del servidor?')) return;
            try {
                await api.delete(`/product-images/${target.id}`);
            } catch (err) {
                console.error("No se pudo eliminar la imagen del servidor:", err);
                alert("Error al intentar quitar la imagen remota.");
                return;
            }
        }

        const filtered = imageFiles.filter((_, i) => i !== indexToRemove);
        
        // Si eliminamos la portada principal, asignamos la primera restante como nueva principal
        if (target.isPrimary && filtered.length > 0) {
            filtered[0].isPrimary = true;
            if (editingProduct && filtered[0].id) {
                await api.patch(`/product-images/${filtered[0].id}`, { isPrimary: true }).catch(console.error);
            }
        }
        
        setImageFiles(filtered);
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

        // Compilar variantes filtrando strings vacíos
        const compiledVariants = variants.map(v => ({
            ...(v.id && { id: v.id }),
            size: v.size || '100ml',
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock) || 0,
        }));
        formDataToSend.append('variants', JSON.stringify(compiledVariants));

        // Calcular el índice real de la portada dentro de los ARCHIVOS NUEVOS que se van a subir
        // Esto evita desfases si mezclamos imágenes viejas con nuevas
        const newFilesOnly = imageFiles.filter(img => img.file);
        const primaryIndex = imageFiles.findIndex(img => img.isPrimary);
        
        if (primaryIndex !== -1) {
            const primaryImage = imageFiles[primaryIndex];
            if (primaryImage.file) {
                // Si la portada elegida es un archivo nuevo, buscamos su índice relativo en el grupo de nuevos
                const relativeIndex = newFilesOnly.indexOf(primaryImage);
                formDataToSend.append('primaryImageIndex', String(relativeIndex));
            } else {
                // Si la portada es una imagen vieja, el backend no necesita procesar archivos nuevos como portada
                formDataToSend.append('primaryImageIndex', '-1');
            }
        }

        // Adjuntar únicamente los binarios nuevos
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

            resetForm();
            fetchProducts();
        } catch (err) {
            console.error('Error al procesar el formulario:', err);
            alert('Ocurrió un problema al guardar los cambios en el servidor.');
        }
    };

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
        setFormData({ name: '', brand: '', description: '', topNotes: '', heartNotes: '', baseNotes: '' });
        setVariants([{ size: '100ml', price: '', stock: '' }]);
        setImageFiles([]);
        setIsCreating(false);
        setEditingProduct(null);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Cabecera */}
            <div className="mb-12 flex flex-col justify-between border-b border-emerald-100 pb-8 sm:flex-row sm:items-end">
                <div>
                    <h1 className="mb-2 text-3xl font-light tracking-[0.2em] uppercase text-emerald-900">
                        {isCreating ? (editingProduct ? 'Editar Fragancia' : 'Añadir Fragancia') : 'Panel de Control'}
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-emerald-600">
                        {isCreating ? 'Ajuste de fórmula olfativa y catálogo' : 'Gestión de Inventario y Colecciones'}
                    </p>
                </div>

                {isCreating ? (
                    <button
                        onClick={resetForm}
                        className="mt-6 flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors sm:mt-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Cancelar y Volver</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="mt-6 flex items-center space-x-2 bg-emerald-800 px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-emerald-700 transition-colors sm:mt-0"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nuevo Perfume</span>
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-emerald-400 animate-pulse">Sincronizando inventario con el servidor...</span>
                </div>
            ) : isCreating ? (
                <form onSubmit={handleSubmit} className="max-w-3xl animate-fadeIn space-y-10">
                    {/* Seccion 1: Datos Core */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Nombre de la Fragancia</label>
                            <input
                                type="text" required
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej. Midnight Saffron"
                                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Colección / Marca</label>
                            <input
                                type="text" required
                                value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="Ej. AURA NOVA Privé"
                                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Seccion 2: Gestión Dinámica de Variantes (Solución al primer problema) */}
                    <div className="border-t border-emerald-100 pt-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Presentaciones y Tamaños (Variantes)</label>
                            <button
                                type="button"
                                onClick={addVariantRow}
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
                                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                            className="w-full border-b border-emerald-200 bg-transparent py-2 text-xs font-light focus:border-emerald-600 focus:outline-none"
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/3">
                                        <input
                                            type="number" required min="0" step="0.01"
                                            placeholder="Precio (Bs.)"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                            className="w-full border-b border-emerald-200 bg-transparent py-2 text-xs font-light focus:border-emerald-600 focus:outline-none"
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/3">
                                        <input
                                            type="number" required min="0"
                                            placeholder="Stock Unidades"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                            className="w-full border-b border-emerald-200 bg-transparent py-2 text-xs font-light focus:border-emerald-600 focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeVariantRow(index)}
                                        className="text-emerald-500 hover:text-red-600 p-1 transition-colors"
                                        title="Eliminar Presentación"
                                    >
                                        <Trash className="h-4 w-4 stroke-1" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seccion 3: Notas Olfativas */}
                    <div className="grid grid-cols-1 gap-8 border-t border-emerald-100 pt-8 sm:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Notas de Salida</label>
                            <input
                                type="text"
                                value={formData.topNotes} onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                                placeholder="Ej. Bergamota, Limón"
                                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Notas de Corazón</label>
                            <input
                                type="text"
                                value={formData.heartNotes} onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                                placeholder="Ej. Jazmín, Rosa"
                                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Notas de Fondo</label>
                            <input
                                type="text"
                                value={formData.baseNotes} onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                                placeholder="Ej. Vainilla, Ámbar"
                                className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2 border-t border-emerald-100 pt-8">
                        <label className="text-[10px] font-medium uppercase tracking-widest text-emerald-800">Historia / Descripción</label>
                        <textarea
                            required rows={4}
                            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe las emociones y sensaciones de la fragancia..."
                            className="w-full border-b border-emerald-200 bg-transparent py-3 text-sm font-light focus:border-emerald-600 focus:outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* Sección 4: Galería e Imagen Principal Integrada */}
                    <div className="space-y-4 border-t border-emerald-100 pt-8">
                        <label className="block text-[10px] font-medium uppercase tracking-widest text-emerald-800">Galería de Imágenes Visuales</label>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                            <div className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center border border-dashed border-emerald-300 bg-emerald-50/30 transition-colors hover:border-emerald-600">
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-10 cursor-pointer opacity-0" />
                                <Plus className="mb-2 h-6 w-6 stroke-1 text-emerald-500 transition-colors group-hover:text-emerald-700" />
                                <span className="text-[10px] uppercase tracking-widest text-emerald-500 transition-colors group-hover:text-emerald-700">Añadir Imagen</span>
                            </div>

                            {imageFiles.map((img, index) => (
                                <div key={index} className="group relative aspect-[3/4] overflow-hidden bg-emerald-50 border border-emerald-100">
                                    <img src={img.preview} alt="Preview" className="h-full w-full object-cover object-center" />
                                    <div className="absolute inset-0 flex flex-col justify-between bg-emerald-950/40 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="self-end bg-red-600/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-red-600"
                                        >
                                            Remover
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => togglePrimaryImage(index)}
                                            className={`w-full py-2 text-center text-[9px] uppercase tracking-widest transition-colors ${img.isPrimary ? 'bg-white font-medium text-emerald-950' : 'bg-emerald-900/80 text-white hover:bg-white hover:text-emerald-950'}`}
                                        >
                                            {img.isPrimary ? 'Portada Principal' : 'Definir Portada'}
                                        </button>
                                    </div>
                                    {img.isPrimary && (
                                        <span className="absolute left-2 top-2 bg-emerald-800 px-2 py-0.5 text-[8px] uppercase tracking-widest text-white tracking-widest">
                                            Principal
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón de Envió */}
                    <div className="flex justify-end pt-8">
                        <button type="submit" className="bg-emerald-800 px-10 py-4 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-emerald-700">
                            {editingProduct ? 'Actualizar Cambios' : 'Guardar Fragancia'}
                        </button>
                    </div>
                </form>
            ) : products.length === 0 ? (
                <div className="flex h-64 items-center justify-center border border-dashed border-emerald-200">
                    <span className="text-xs uppercase tracking-widest text-emerald-500">No hay fragancias registradas en el catálogo del servidor.</span>
                </div>
            ) : (
                <div className="animate-fadeIn overflow-x-auto">
                    <table className="w-full text-left text-sm font-light text-emerald-700">
                        <thead className="border-b border-emerald-200 bg-emerald-50 text-[10px] uppercase tracking-widest text-emerald-900">
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
                                const basePrice = Number(product.variants?.[0]?.price) || 0;
                                const totalStock = (product.variants || []).reduce((acc, curr) => acc + curr.stock, 0);

                                return (
                                    <tr key={product.id} className="border-b border-emerald-100 transition-colors hover:bg-emerald-50/30">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-900">#{product.id}</td>
                                        <td className="px-6 py-4 text-emerald-900">{product.name}</td>
                                        <td className="px-6 py-4 text-[10px] uppercase tracking-widest text-emerald-500">{product.brand}</td>
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
                                                    className="text-emerald-400 transition-colors hover:text-emerald-800" 
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-emerald-400 transition-colors hover:text-red-600"
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