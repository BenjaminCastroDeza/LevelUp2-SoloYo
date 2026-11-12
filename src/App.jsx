// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Carrito from './Pages/Carrito';
import Registro from './Pages/Registro';
import Login from './Pages/Login';
import AdminProductos from './Pages/AdminProductos';
import FormProducto from './Pages/FormProducto';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    if (confirm('¿Deseas cerrar sesión?')) {
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      window.location.reload();
    }
  };

  return (
    <CartProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path = "/Home" element={<Home />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path ="/login" element={<Login setCurrentUser={setCurrentUser} />} />   

          <Route path="/admin" element={<AdminProductos />} />
          <Route path="/admin/crear" element={<FormProducto />} />
          <Route path="/admin/editar/:id" element={<FormProducto />} />     
        </Routes>
      </div>
    </CartProvider>
  );
}