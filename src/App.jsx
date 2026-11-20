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
import Perfil from './Pages/Perfil';
import ProtectedRoute from './Components/ProtectedRoute';

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

  // Semilla de usuarios por defecto en el navegador para pruebas locales
  useEffect(() => {
    if (import.meta.env.MODE !== 'test') {
      try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const hasAdmin = users.some(
          (u) => u.correo.toLowerCase() === 'admin@levelup.cl'
        );
        if (!hasAdmin) {
          users.push({
            id: 1,
            nombre: 'Administrador LevelUp',
            correo: 'admin@levelup.cl',
            contrasena: 'Admin123!',
            rol: 'ROLE_ADMIN',
            telefono: '912345678',
            region: 'Region Metropolitana',
            comuna: 'Santiago'
          });
          users.push({
            id: 2,
            nombre: 'Cliente LevelUp',
            correo: 'cliente@levelup.cl',
            contrasena: 'User123!',
            rol: 'ROLE_CLIENTE',
            telefono: '912345678',
            region: 'Region Metropolitana',
            comuna: 'Santiago'
          });
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch {}
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    if (confirm('¿Deseas cerrar sesión?')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      localStorage.removeItem('cart_items');
      window.dispatchEvent(new Event('levelup:logout'));
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
          <Route path="/Home" element={<Home />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/perfil" element={<Perfil currentUser={currentUser} onLogout={handleLogout} />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="ROLE_ADMIN">
                <AdminProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/crear"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="ROLE_ADMIN">
                <FormProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/editar/:id"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="ROLE_ADMIN">
                <FormProducto />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </CartProvider>
  );
}