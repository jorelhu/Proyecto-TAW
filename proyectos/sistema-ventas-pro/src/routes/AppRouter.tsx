import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductosPage from "../pages/ProductosPage";
import Home from "../pages/Home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}