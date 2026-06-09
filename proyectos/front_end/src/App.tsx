// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import ProductForm from './components/ProductForm';
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased font-sans flex flex-col">
        {/* Encabezado global */}
        <Navbar />
        <CartDrawer />

        {/* Contenedor dinámico */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
          </Routes>
        </main>

        {/* Footer Minimalista */}
        <footer className="border-t border-neutral-200 py-8 bg-white text-center text-[10px] tracking-widest text-neutral-400 uppercase">
          © {new Date().getFullYear()} Aura Nova Privé. Todos los derechos reservados.
        </footer>
      </div>
    </Router>
  );
};

export default App;