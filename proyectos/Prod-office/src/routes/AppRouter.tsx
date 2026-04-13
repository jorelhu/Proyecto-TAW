import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductosPage from "../features/productos/pages/ProductosPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<ProductosPage />} />
        </Routes>
    </BrowserRouter>
    );
}
