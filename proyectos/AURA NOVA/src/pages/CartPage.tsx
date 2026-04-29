import { useCart } from "../shared/components/CartContext";

const CartPage = () => {
  const { cart, total } = useCart();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Carrito</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-xl flex justify-between items-center"
          >
            <span className="font-medium">{item.name}</span>

            <span className="text-teal-700 font-semibold">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right text-2xl font-bold text-teal-700">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default CartPage;