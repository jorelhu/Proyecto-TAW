import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

import HomePage from "../../pages/HomePage";
import ProductsPage from "../..//pages/ProductsPage";
import CartPage from "../..//pages/CartPage";
import LoginPage from "../..//pages/LoginPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Layout principal */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/carrito" element={<CartPage />} />
        </Route>

        {/* Rutas sin layout */}
        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;