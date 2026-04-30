import { ShoppingBag } from "lucide-react";
import { useCart } from "../shared/components/useCart";

const CartPage = () => {
  const { cart, total } = useCart();

  const comprarWhatsApp = () => {
    const numero = "59175209520"; // Cambia por tu número

    const productos = cart
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("%0A");

    const mensaje =
      `Hola, quiero realizar la siguiente compra:%0A%0A` +
      `${productos}%0A%0A` +
      `Total: $${total.toFixed(2)}`;

    const url = `https://wa.me/${numero}?text=${mensaje}`;

    window.open(url, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        🛒 Carrito de Compras
      </h1>

      {cart.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-2xl text-center text-gray-500 text-xl">
          Tu carrito está vacío
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h2>

                    <p className="text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-xl font-bold text-teal-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-teal-50 rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-5">
              <span className="text-2xl font-semibold text-gray-700">
                Total:
              </span>

              <span className="text-3xl font-bold text-teal-700">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={comprarWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag size={22} />
              Comprar por WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;