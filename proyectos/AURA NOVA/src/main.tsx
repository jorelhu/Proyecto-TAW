import { AuthProvider } from "./features/auth/context/AuthContext";
import "./styles/global.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CartProvider } from "./shared/components/CartContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);