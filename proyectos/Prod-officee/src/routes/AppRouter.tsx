import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductosPage from "../features/productos/pages/ProductosPage";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<DashboardLayout />}>
          <Route path="/productos" element={<ProductosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
