// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/useCart';

export default function Navbar({ currentUser, onLogout }) {
  const { totalCartCount } = useCart();
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = busqueda.trim();
    if (query) {
      navigate(`/?q=${encodeURIComponent(query)}#catalogo`);
    } else {
      navigate('/#catalogo');
    }
  };

  const primerNombre = currentUser?.nombre
    ? currentUser.nombre.split(' ')[0]
    : 'Usuario';

  return (
    <header className="py-2 sticky-top top-header">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* 1. Logotipo y Marca */}
          <Link
            to="/"
            className="d-flex align-items-center gap-2 text-decoration-none text-white brand-font fs-4"
          >
            <i className="bi bi-controller fs-2" style={{ color: 'var(--color-accent)' }}></i>
            <span className="fw-bold tracking-wide">
              LEVEL-UP <span style={{ color: 'var(--color-accent)' }}>GAMER</span>
            </span>
          </Link>

          {/* 2. Enlaces de navegación con iconos (sin emojis) */}
          <nav className="d-flex align-items-center order-1 order-md-2">
            <ul className="nav gap-1">
              <li className="nav-item">
                <Link className="nav-link px-3 d-flex align-items-center gap-2" to="/">
                  <i className="bi bi-house-door"></i>
                  <span>Inicio</span>
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3 d-flex align-items-center gap-2" href="/#catalogo">
                  <i className="bi bi-grid-3x3-gap"></i>
                  <span>Productos</span>
                </a>
              </li>
              <li className="nav-item">
                <Link
                  className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 mx-1 px-3 fw-semibold"
                  to="/admin"
                >
                  <i className="bi bi-shield-lock"></i>
                  <span>Admin</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* 3. Barra de búsqueda */}
          <form
            className="d-flex flex-grow-1 mx-lg-3 order-3 order-lg-2"
            style={{ maxWidth: '380px', minWidth: '200px' }}
            onSubmit={handleSearch}
            role="search"
          >
            <div className="input-group input-group-sm w-100">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control border-start-0"
                placeholder="Buscar consolas, periféricos, juegos..."
                aria-label="Buscar productos"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  type="button"
                  className="btn btn-outline-secondary border-start-0 border-end-0 text-secondary"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar búsqueda"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </form>

          {/* 4. Grupo de acciones: Usuario (persona) al lado del Carrito */}
          <div className="d-flex align-items-center gap-2 order-2 order-lg-3 ms-auto ms-lg-0">
            {/* Botón de usuario / Iniciar sesión con icono de persona */}
            {currentUser ? (
              <button
                onClick={onLogout}
                className="btn btn-sm btn-outline-info d-flex align-items-center gap-2"
                id="nav-user"
                aria-label={`Hola, ${primerNombre} (Salir)`}
                title={`Hola, ${primerNombre}`}
              >
                <i className="bi bi-person-circle fs-5"></i>
                <span className="d-none d-md-inline">Hola, {primerNombre} (Salir)</span>
              </button>
            ) : (
              <Link
                to="/login"
                id="nav-user"
                className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
                aria-label="Iniciar sesión"
                title="Iniciar sesión"
              >
                <i className="bi bi-person fs-5"></i>
                <span className="d-none d-sm-inline">Iniciar sesión</span>
              </Link>
            )}

            {/* Botón del Carrito */}
            <Link
              to="/carrito"
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
              aria-label={`Cart (${totalCartCount})`}
            >
              <i className="bi bi-cart3 fs-5"></i>
              <span className="d-none d-sm-inline">Cart (</span>
              <span id="cart-count" className="badge bg-info text-dark rounded-pill fw-bold">
                {totalCartCount}
              </span>
              <span className="d-none d-sm-inline">)</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
