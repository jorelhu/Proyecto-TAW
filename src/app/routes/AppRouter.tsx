import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProductDetailPage from "../../pages/ProductDetailPage";
import HomePage from "../../pages/HomePage";
import ProductsPage from "../../pages/ProductsPage";  // ← Corregido
import CartPage from "../../pages/CartPage";
import LoginPage from "../../pages/LoginPage";
import ScrollToTop from "../../shared/components/ScrollToTop";
import CartProvider from "../../shared/components/CartProvider";  // ← Agregado

const AppRouter = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* Layout principal */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
          </Route>

          {/* Rutas sin layout */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default AppRouter;