// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/useCart';

export default function Navbar({ currentUser, onLogout }) {
  const { carrito, totalCartCount } = useCart();
  const [busqueda, setBusqueda] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const subtotalCarrito = carrito.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 1),
    0
  );

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

            {/* Botón y Menú Desplegable del Carrito */}
            <div className="position-relative" ref={cartRef}>
              <button
                type="button"
                id="cart-toggle-btn"
                className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
                aria-label={`Cart (${totalCartCount})`}
                aria-expanded={cartOpen}
                onClick={() => setCartOpen((prev) => !prev)}
                title="Ver carrito de compras"
              >
                <i className="bi bi-cart3 fs-5"></i>
                <span className="d-none d-sm-inline">Cart (</span>
                <span id="cart-count" className="badge bg-info text-dark rounded-pill fw-bold">
                  {totalCartCount}
                </span>
                <span className="d-none d-sm-inline">)</span>
              </button>

              {/* Menú Desplegable */}
              {cartOpen && (
                <div
                  className="dropdown-menu dropdown-menu-dark-custom dropdown-menu-end p-3 show position-absolute mt-2 shadow-lg"
                  style={{ right: 0, minWidth: '320px', maxWidth: '360px', zIndex: 1060 }}
                  role="dialog"
                  aria-label="Resumen del carrito"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary border-opacity-50">
                    <span className="fw-bold text-white small d-flex align-items-center gap-2">
                      <i className="bi bi-cart3 text-info"></i> Tu Carrito
                    </span>
                    <span className="badge bg-secondary small">
                      {totalCartCount} {totalCartCount === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>

                  {carrito.length === 0 ? (
                    <div className="text-center py-4 text-secondary">
                      <i className="bi bi-cart-x fs-1 d-block mb-2 text-secondary opacity-75"></i>
                      <p className="small mb-1 text-white">Tu carrito está vacío</p>
                      <p className="small text-secondary mb-0">Agrega productos desde el catálogo</p>
                    </div>
                  ) : (
                    <>
                      <div
                        className="pe-1 my-2"
                        style={{ maxHeight: '220px', overflowY: 'auto' }}
                      >
                        {carrito.map((item) => (
                          <div
                            key={item.id}
                            className="d-flex align-items-center gap-2 py-2 border-bottom border-secondary border-opacity-25"
                          >
                            <img
                              src={item.img}
                              alt={item.nombre}
                              className="rounded border border-secondary"
                              style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                              <div
                                className="text-white small text-truncate fw-semibold"
                                title={item.nombre}
                              >
                                {item.nombre}
                              </div>
                              <div className="text-secondary small">
                                {item.cantidad} x ${Number(item.precio || 0).toLocaleString('es-CL')}
                              </div>
                            </div>
                            <div className="text-info small fw-bold text-nowrap">
                              ${(Number(item.precio || 0) * (item.cantidad || 1)).toLocaleString('es-CL')}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 pb-1 border-top border-secondary border-opacity-50 my-2">
                        <span className="text-secondary small">Subtotal estimado:</span>
                        <span className="text-white fw-bold fs-6">
                          ${subtotalCarrito.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    </>
                  )}

                  <Link
                    to="/carrito"
                    className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2"
                    onClick={() => setCartOpen(false)}
                  >
                    <i className="bi bi-arrow-right-circle"></i>
                    <span>Ir a la página del carrito</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
