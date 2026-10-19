import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({setCurrentUser}) {

    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errorCorreo, setErrorCorreo] = useState('');
    const [errorContrasena, setErrorContrasena] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        setErrorCorreo('');
        setErrorContrasena('');

        let esvalido = true;
        
        const correoLimpio = correo.trim();

        //Validar correo
        const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoLimpio) {
            setErrorCorreo('El correo es obligatorio.');
            esvalido = false;
        } else if (!regEmail.test(correoLimpio)) {
            setErrorCorreo('El correo no es válido.');
            esvalido = false;
        }

        //Validar contraseña
        if (!contrasena) {
            setErrorContrasena('La contraseña es obligatoria.');
            esvalido = false;
        }
        
        if (!esvalido)  return;

        // Obtener usuarios del localStorage
        const usuarios = JSON.parse(localStorage.getItem('users')) || [];
        const usuarioEncontrado = usuarios.find(
            (u) => u.correo.toLowerCase() === correoLimpio.toLowerCase()
        );


        //Error cuenta inexistente
        if (!usuarioEncontrado) {
            setErrorCorreo('El correo no está registrado.');
            return;
        }

        //Error contraseña incorrecta
        const contraseñaGuardada = usuarioEncontrado.contrasena;
        if (contraseñaGuardada !== contrasena) {
            setErrorContrasena('La contraseña es incorrecta.');
            return;
        }

        //Autenticacion exitosa
        localStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));
        setCurrentUser(usuarioEncontrado);
        alert(`¡Bienvenido, ${usuarioEncontrado.nombre}! Has iniciado sesión correctamente.`);
        navigate('/');
    };
    return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          {/* Logo y Nombre de empresa superior */}
          <div className="text-center mb-4">
            <i className="bi bi-controller display-3 text-primary"></i>
            <h2 className="brand-font text-white mt-2">LEVEL-UP GAMER</h2>
            <p className="text-secondary small">
              Ingresa a tu cuenta para continuar comprando
            </p>
          </div>

          {/* Contenedor del Login */}
          <div className="card-gamer p-4 p-md-5 border border-secondary shadow-lg rounded-3">
            <h3 className="h5 brand-font text-white mb-4 border-bottom border-secondary pb-2">
              Inicio de sesión
            </h3>

            <form onSubmit={handleSubmit} noValidate>
              {/* Correo */}
              <div className="mb-3">
                <label htmlFor="correo" className="form-label text-white small fw-bold">
                  CORREO
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {errorCorreo && (
                  <span className="error-msg text-danger small d-block mt-1">
                    {errorCorreo}
                  </span>
                )}
              </div>

              {/* Contraseña */}
              <div className="mb-4">
                <label htmlFor="contrasena" className="form-label text-white small fw-bold">
                  CONTRASEÑA
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
                {errorContrasena && (
                  <span className="error-msg text-danger small d-block mt-1">
                    {errorContrasena}
                  </span>
                )}
              </div>

              {/* Botón Ingresar */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold text-uppercase"
              >
                Iniciar sesión
              </button>
            </form>

            {/* Enlace destacado a Registro */}
            <div className="text-center mt-4 pt-3 border-top border-secondary">
              <span className="text-secondary small">¿No tienes cuenta todavía?</span>
              <br />
              <Link to="/registro" className="text-info fw-bold text-decoration-none small">
                <i className="bi bi-person-plus me-1"></i> Registrar usuario aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}