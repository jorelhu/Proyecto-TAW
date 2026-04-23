import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProductDetailPage from "../../pages/ProductDetailPage";
import HomePage from "../../pages/HomePage";
import ProductsPage from "../..//pages/ProductsPage";
import CartPage from "../../pages/CartPage";
import LoginPage from "../../pages/LoginPage";
import ScrollToTop from "../../shared/components/ScrollToTop";

const AppRouter = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default AppRouter;