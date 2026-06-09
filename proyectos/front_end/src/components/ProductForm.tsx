import React, { useState } from 'react';
import { productService, type ProductData } from '../services/api';

interface Message {
  text: string;
  type: 'success' | 'error';
}

const ProductForm: React.FC = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    brand: '',
    description: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
  });

  // Estado para las imágenes
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  // Enviar formulario usando FormData
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Crear FormData
      const formDataToSend = new FormData();
      
      // Adjuntar campos de texto
      formDataToSend.append('name', formData.name);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('description', formData.description);
      if (formData.topNotes) formDataToSend.append('topNotes', formData.topNotes);
      if (formData.heartNotes) formDataToSend.append('heartNotes', formData.heartNotes);
      if (formData.baseNotes) formDataToSend.append('baseNotes', formData.baseNotes);
      
      // Adjuntar archivos de imagen
      imageFiles.forEach((imgFile) => {
        formDataToSend.append('files', imgFile);
      });
      
      // Enviar al backend
      await productService.createWithImages(formDataToSend);
      
      setMessage({ text: 'Producto creado exitosamente!', type: 'success' });
      
      // Limpiar formulario
      setFormData({
        name: '',
        brand: '',
        description: '',
        topNotes: '',
        heartNotes: '',
        baseNotes: '',
      });
      setImageFiles([]);
      
      const fileInput = document.getElementById('imageInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Error al crear producto', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Crear Producto</h2>
      
      {message && (
        <div style={{
          padding: '10px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Marca:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Notas de Salida (topNotes):</label>
          <input
            type="text"
            name="topNotes"
            value={formData.topNotes}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ej: Bergamota, Limón"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Notas de Corazón (heartNotes):</label>
          <input
            type="text"
            name="heartNotes"
            value={formData.heartNotes}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ej: Rosa, Jazmín"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Notas de Fondo (baseNotes):</label>
          <input
            type="text"
            name="baseNotes"
            value={formData.baseNotes}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ej: Vainilla, Ámbar"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Imágenes del producto:</label>
          <input
            id="imageInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: '5px' }}
          />
          {imageFiles.length > 0 && (
            <small style={{ display: 'block', marginTop: '5px' }}>
              {imageFiles.length} archivo(s) seleccionado(s)
            </small>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;