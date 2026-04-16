import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, ShoppingCart, Heart, Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";

// Mock actualizado con más datos para enriquecer la vista
const PRODUCTS = [
  { 
    id: 1, 
    name: "Mystic Oud", 
    brand: "AURA NOVA", 
    price: 120, 
    rating: 5, 
    reviews: 128,
    description: "Una fragancia intensa y misteriosa. Un viaje olfativo que comienza con notas especiadas y se asienta en un corazón profundo de madera de oud y ámbar. Perfecta para la noche.", 
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800",
      "https://images.unsplash.com/photo-1615397323282-31121c252a1d?q=80&w=800"
    ],
    sizes: ["50ml", "100ml", "150ml"],
    notes: { top: "Pimienta Rosa, Azafrán", heart: "Rosa Búlgara, Cedro", base: "Oud, Ámbar, Almizcle" }
  },
  { 
    id: 2, 
    name: "Velvet Rose", 
    brand: "AURA NOVA", 
    price: 95, 
    rating: 4, 
    reviews: 18,
    description: "Una fragancia intensa y misteriosa. Un viaje olfativo que comienza con notas especiadas y se asienta en un corazón profundo de madera de oud y ámbar. Perfecta para la noche.", 
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800",
      "https://images.unsplash.com/photo-1615397323282-31121c252a1d?q=80&w=800"
    ],
    sizes: ["50ml", "100ml", "150ml"],
    notes: { top: "Pimienta Rosa, Azafrán", heart: "Rosa Búlgara, Cedro", base: "Oud, Ámbar, Almizcle" }
  },
  // ... (puedes agregar más productos aquí)
];

const ProductDetailPage = () => {
  const { id } = useParams();
  
  // Como no hay backend aún, forzamos el id 1 si no encuentra para ver el diseño
  const product = PRODUCTS.find(p => p.id === Number(id)) || PRODUCTS[0];

  // Estados interactivos
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]); // Selecciona 100ml por defecto
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("notes");

  // Funciones auxiliares
  const handleQuantity = (action: "increase" | "decrease") => {
    if (action === "decrease" && quantity > 1) setQuantity(q => q - 1);
    if (action === "increase" && quantity < 10) setQuantity(q => q + 1);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* COLUMNA IZQUIERDA: Galería de Imágenes */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-24 h-fit">
        
        {/* Imagen Principal */}
        <div className="w-full aspect-[4/5] sm:aspect-square bg-white rounded-3xl p-8 flex items-center justify-center border border-stone-200 overflow-hidden">
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="max-h-full w-auto object-contain transition-opacity duration-500"
            // Clave para que React re-renderice la animación al cambiar de imagen
            key={activeImage} 
          />
        </div>

        {/* Selector de Imágenes (Miniaturas) */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {product.images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 overflow-hidden bg-white p-2 transition-all ${
                activeImage === idx ? "border-stone-900" : "border-stone-200 hover:border-stone-400"
              }`}
            >
              <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      </div>


      {/* COLUMNA DERECHA: Información y Controles */}
      <div className="flex flex-col pt-2 lg:pt-6">
        
        {/* Migas de pan (Breadcrumbs) - Simulado */}
        <nav className="text-sm text-stone-500 mb-6 flex gap-2">
          <a href="/" className="hover:text-stone-900 transition-colors">Inicio</a>
          <span>/</span>
          <a href="#" className="hover:text-stone-900 transition-colors">Perfumes</a>
          <span>/</span>
          <span className="text-stone-900">{product.name}</span>
        </nav>

        <p className="text-sm uppercase tracking-[0.2em] text-stone-500 mb-2 font-medium">
          {product.brand}
        </p>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-950 mb-4">
          {product.name}
        </h1>

        {/* Rating y Reseñas */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < product.rating ? "fill-stone-900 text-stone-900" : "text-stone-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-stone-500 underline cursor-pointer hover:text-stone-900">
            {product.reviews} reseñas
          </span>
        </div>

        <p className="text-3xl font-medium text-stone-950 mb-6">
          ${product.price}.00
        </p>

        <p className="text-base text-stone-600 mb-8 font-light leading-relaxed">
          {product.description}
        </p>

        {/* Selector de Tamaño */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-stone-950 uppercase tracking-wider">Tamaño</span>
            <button className="text-xs text-stone-500 underline hover:text-stone-900">Guía de tamaños</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 rounded-full text-sm font-medium border transition-all ${
                  selectedSize === size 
                    ? "border-stone-900 bg-stone-900 text-white" 
                    : "border-stone-200 text-stone-700 hover:border-stone-400 bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Controles de Compra (Cantidad + Botones) */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          
          {/* Input de cantidad personalizado */}
          <div className="flex items-center justify-between border border-stone-300 rounded-full px-4 py-1 sm:w-32 bg-white">
            <button onClick={() => handleQuantity("decrease")} className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium text-stone-950 w-8 text-center">{quantity}</span>
            <button onClick={() => handleQuantity("increase")} className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Botón Añadir al carrito */}
          <button className="flex-1 bg-stone-900 text-white px-8 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-stone-800 transition-colors font-medium">
            <ShoppingCart className="w-5 h-5" />
            Añadir al carrito - ${(product.price * quantity).toFixed(2)}
          </button>

          {/* Botón Wishlist */}
          <button className="flex items-center justify-center p-4 border border-stone-300 rounded-full hover:border-stone-900 hover:bg-stone-50 text-stone-600 transition-all group">
            <Heart className="w-6 h-6 group-hover:fill-stone-200" />
          </button>
        </div>

        {/* Acordeones de Información Extra */}
        <div className="border-t border-stone-200">
          
          {/* Acordeón: Notas Olfativas */}
          <div className="border-b border-stone-200">
            <button 
              onClick={() => toggleAccordion("notes")}
              className="w-full flex items-center justify-between py-5 text-left font-medium text-stone-900 hover:text-stone-600 transition-colors"
            >
              Notas Olfativas
              {activeAccordion === "notes" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === "notes" ? "max-h-48 pb-5" : "max-h-0"}`}>
              <ul className="text-sm text-stone-600 space-y-2 font-light">
                <li><strong className="text-stone-900 font-medium">Salida:</strong> {product.notes.top}</li>
                <li><strong className="text-stone-900 font-medium">Corazón:</strong> {product.notes.heart}</li>
                <li><strong className="text-stone-900 font-medium">Fondo:</strong> {product.notes.base}</li>
              </ul>
            </div>
          </div>

          {/* Acordeón: Envío y Devoluciones */}
          <div className="border-b border-stone-200">
            <button 
              onClick={() => toggleAccordion("shipping")}
              className="w-full flex items-center justify-between py-5 text-left font-medium text-stone-900 hover:text-stone-600 transition-colors"
            >
              Envío y Devoluciones
              {activeAccordion === "shipping" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === "shipping" ? "max-h-48 pb-5" : "max-h-0"}`}>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Envío estándar gratuito en pedidos superiores a $150. Entregas en 2-4 días laborables. 
                Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté sin abrir.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;