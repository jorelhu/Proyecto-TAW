import { useCart } from "../shared/components/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

const CartPage = () => {
  const { cart, total, updateQuantity, removeFromCart } = useCart();

  // Constante para un envío simulado (gratis si supera $150)
  const shippingThreshold = 150;
  const shippingCost = total > shippingThreshold || total === 0 ? 0 : 15;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-950 mb-10">
        Tu Selección
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-3xl border border-stone-100">
          <ShoppingBag className="w-16 h-16 text-stone-300 mb-6 stroke-[1]" />
          <p className="text-xl font-serif text-stone-900 mb-2">Tu carrito está vacío</p>
          <p className="text-stone-500 mb-8 font-light text-center max-w-md">
            Parece que aún no has encontrado tu aroma insignia. Explora nuestra colección para descubrir fragancias únicas.
          </p>
          <a href="/productos" className="bg-stone-900 text-white px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition-colors">
            Explorar Catálogo
          </a>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Lista de Productos */}
          <div className="lg:col-span-8 flex flex-col gap-6 mb-10 lg:mb-0">
            {/* Encabezado de tabla (solo desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <div className="col-span-6">Producto</div>
              <div className="col-span-3 text-center">Cantidad</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 bg-white p-4 sm:p-0 sm:py-6 border-b border-stone-100 items-start sm:items-center relative group"
              >
                {/* Imagen */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-stone-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-3 border border-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full object-contain"
                  />
                </div>

                {/* Info (Producto) */}
                <div className="flex-1 w-full sm:w-auto">
                  {item.brand && (
                    <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">{item.brand}</p>
                  )}
                  <h3 className="font-serif font-medium text-lg sm:text-xl text-stone-950 mb-1">{item.name}</h3>
                  {item.size && (
                    <p className="text-sm text-stone-600 font-light mb-2">Tamaño: {item.size}</p>
                  )}
                  <p className="text-stone-900 font-medium sm:hidden mb-4">${item.price.toFixed(2)}</p>

                  {/* Controles en Móvil (Se alinean a la izquierda) */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div className="flex items-center border border-stone-300 rounded-full h-10 w-28 justify-between">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 text-stone-500 hover:text-stone-900 disabled:opacity-50">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-stone-500 hover:text-stone-900">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Controles en Desktop (Alineados a la derecha) */}
                <div className="hidden sm:flex col-span-3 items-center justify-center w-32">
                  <div className="flex items-center border border-stone-300 rounded-full h-10 w-full justify-between px-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 text-stone-500 hover:text-stone-900 disabled:opacity-50 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-medium text-sm text-stone-900 w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Precio Total por Item y Eliminar (Desktop) */}
                <div className="hidden sm:flex col-span-3 items-center justify-end w-32 gap-6 text-right">
                  <span className="font-semibold text-stone-950 text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500 transition-colors" title="Eliminar producto">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Resumen del Pedido */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200">
              <h2 className="font-serif text-2xl text-stone-950 mb-6">Resumen</h2>
              
              <div className="flex flex-col gap-4 text-stone-600 border-b border-stone-200 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-medium text-stone-900">
                    {shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-medium text-stone-900">Total</span>
                <span className="text-3xl font-bold text-stone-950">
                  ${(total + shippingCost).toFixed(2)}
                </span>
              </div>

              <button className="w-full bg-stone-900 text-white py-4 rounded-full font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 group mb-4">
                Proceder al pago
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-start gap-3 text-xs text-stone-500 mt-6">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-stone-400" />
                <p>Pago seguro garantizado. Tus datos están protegidos y encriptados en todo momento.</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;