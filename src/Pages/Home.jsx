// src/pages/Home.jsx
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../Context/useCart';
import Footer from '../Components/Footer';

export default function Home() {
  const { productos, agregarAlCarrito } = useCart();
  const [searchParams] = useSearchParams();
  const busqueda = (searchParams.get('q') || '').trim().toLowerCase();

  const productosFiltrados = busqueda
    ? productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda) ||
          p.categoria.toLowerCase().includes(busqueda)
      )
    : productos;

  return (
    <>
      <main className="container my-5">
        {/* Portada (Hero) a 2 Columnas */}
        <section className="row align-items-center py-4 mb-5 hero-section">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold mb-3 text-white brand-font">TIENDA ONLINE GAMER</h1>
            <p className="lead text-secondary mb-4">
              Equípate con el mejor hardware, accesorios de alto rendimiento y sillas ergonómicas en Chile. Sube de nivel tu experiencia de juego.
            </p>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src="/imagenes/foto principal.jpg"
              alt="Setup gamer profesional con iluminación RGB de Level-Up Gamer"
              className="img-fluid rounded-3 border border-secondary shadow"
            />
          </div>
        </section>

        {/* Catálogo de Productos dinámico con .map() */}
        <section id="catalogo" className="my-5 pt-3">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white brand-font">Catálogo Destacado</h2>
            <p className="text-secondary">Selección oficial de productos para potenciar tu juego</p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {productosFiltrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-search display-3 text-secondary mb-3 d-block"></i>
                <h4 className="text-white">No se encontraron productos</h4>
                <p className="text-secondary">
                  No hay resultados para "{busqueda}". Intenta con otra palabra clave.
                </p>
              </div>
            ) : (
              productosFiltrados.map((prod) => (
                <div className="col" key={prod.id}>
                  <article className="card h-100 p-3 card-gamer d-flex flex-column justify-content-between">
                    <img 
                      className="foto-producto card-img-top rounded mb-3" 
                      src={prod.img} 
                      alt={prod.nombre} 
                    />
                    <div>
                      <h3 className="h6 text-white mb-2">{prod.nombre}</h3>
                      <p className="fs-5 fw-bold text-info mb-3">
                        ${prod.precio.toLocaleString('es-CL')} CLP
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => agregarAlCarrito(prod)}
                      className="btn btn-outline-primary w-100 fw-bold"
                    >
                      <i className="bi bi-cart-plus me-1"></i> Agregar
                    </button>
                  </article>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}