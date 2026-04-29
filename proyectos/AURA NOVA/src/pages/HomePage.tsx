// src/App.tsx
import { Link } from "react-router-dom";
import { ArrowRight, Star, Leaf, Droplets } from "lucide-react";
import { useCart } from "../shared/components/CartContext";

const DUMMY_PRODUCTS = [
  { id: 1, name: "Mystic Oud", brand: "AURA NOVA", price: 120, rating: 5, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600" },
  { id: 2, name: "Velvet Rose", brand: "AURA NOVA", price: 95, rating: 4, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600" },
  { id: 3, name: "Oceanic Breeze", brand: "AURA NOVA", price: 85, rating: 5, image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600" },
  { id: 4, name: "Sandalwood Sun", brand: "AURA NOVA", price: 110, rating: 4, image: "https://images.unsplash.com/photo-1615397323282-31121c252a1d?q=80&w=600" },
];

function HomePage() {
  const { addToCart } = useCart();

  return (
    <>
    {/* --- SECCIÓN HERO --- */} <section className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 sm:mb-24"> {/* Columna de Texto */} <div className="flex-1 text-center md:text-left"> <span className="text-sm font-semibold uppercase tracking-widest text-stone-600 mb-2 block">Nueva Colección 2024</span> <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-950 mb-6 leading-tight"> Tu mejor version <br /> empieza aqui. </h1> <p className="text-lg text-stone-700 mb-10 max-w-xl mx-auto md:mx-0 font-light"> Explora nuestra exclusiva selección de fragancias de lujo, diseñadas para despertar tus sentidos y evocar emociones inolvidables. </p> <Link to="/productos" className="bg-teal-700 text-white px-8 py-4 rounded-full font-medium text-sm flex items-center gap-2.5 mx-auto md:mx-0 hover:bg-teal-800 transition-colors group max-w-52" > Explorar Catálogo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> </Link> </div> {/* Columna de Imagen - Aquí está el control de tamaño */} <div className="flex-1 w-full max-w-xl md:max-w-none"> {/* Contenedor de la imagen: ancho máximo, altura fija, object-cover y bordes redondeados */} <div className="aspect-[4/5] w-full h-[450px] sm:h-[550px] rounded-3xl overflow-hidden shadow-xl border-4 border-white"> <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200" alt="Frasco de perfume AURA NOVA" className="w-full h-full object-cover object-center" /> </div> </div> </section>
      {/* NOVEDADES */}
      <section className="mb-20 sm:mb-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-serif font-bold text-stone-950">
            Nuevas Fragancias
          </h2>

          <Link
            to="/productos"
            className="text-sm font-medium text-stone-600 hover:text-stone-950 flex items-center gap-1.5 group"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* GRID */}
       

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
  {DUMMY_PRODUCTS.map((product) => (
    <Link
      key={product.id}
      to={`/producto/${product.id}`}
      className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="w-full aspect-square p-6 flex items-center justify-center bg-stone-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1.5">
          {product.brand}
        </p>

        <h3 className="text-lg font-medium text-stone-950 mb-3 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-0.5 text-stone-900">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < product.rating
                    ? "fill-stone-900"
                    : "text-stone-300"
                }`}
              />
            ))}
          </div>

          <p className="text-xl font-bold text-teal-700">
            ${product.price}
          </p>
        </div>

        {/* Botón carrito */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            addToCart(product);
          }}
          className="mt-5 bg-teal-700 text-white py-2 rounded-full text-sm hover:bg-teal-800 transition-colors"
        >
          Agregar al carrito
        </button>
      </div>
    </Link>
  ))}
</div>
      </section>
    {/* --- SECCIÓN VALORES --- */} <section className="py-16 sm:py-20 bg-teal-700 rounded-3xl text-white mb-20 sm:mb-24 px-10"> <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center"> <div className="flex flex-col items-center"> <Leaf className="w-12 h-12 text-teal-100 mb-6 stroke-[1]" /> <h4 className="text-lg font-semibold mb-3">Esencias Naturales</h4> <p className="text-teal-50 text-sm font-light"> Seleccionamos cuidadosamente ingredientes de origen natural. </p> </div> <div className="flex flex-col items-center"> <Droplets className="w-12 h-12 text-teal-100 mb-6 stroke-[1]" /> <h4 className="text-lg font-semibold mb-3">Larga Duración</h4> <p className="text-teal-50 text-sm font-light"> Nuestras fórmulas garantizan un aroma perdurable todo el día. </p> </div> <div className="flex flex-col items-center"> <Star className="w-12 h-12 text-teal-100 mb-6 stroke-[1]" /> <h4 className="text-lg font-semibold mb-3">Calidad Premium</h4> <p className="text-teal-50 text-sm font-light"> Cada frasco es una obra de arte y sofisticación. </p> </div> </div> </section> </> ); } export default HomePage;