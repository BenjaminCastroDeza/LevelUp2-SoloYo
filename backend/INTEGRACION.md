# Documento de Integración: Frontend React & Backend Spring Boot
**Proyecto:** LevelUp Gamer  
**Asignatura:** DSY1104 - Desarrollo Fullstack II (Evaluación Parcial N° 3)  
**Institución:** Duoc UC  

---

## 1. Arquitectura General del Sistema

El sistema implementa una arquitectura cliente-servidor desacoplada basada en servicios REST:

```
+------------------------------------+          HTTP / JSON          +--------------------------------------+          JDBC          +---------------------------+
|          FRONTEND REACT            |  =========================>  |         BACKEND SPRING BOOT          |  ===================>  |       BASE DE DATOS       |
|    (Vite, React Router, Context)   |                              |  (Spring Security, JPA, Controller)  |                        |          MySQL 8          |
|    http://localhost:5173           |  <=========================  |       http://localhost:8080          |  <===================  |       localhost:3306      |
+------------------------------------+       JWT Bearer Token       +--------------------------------------+                        +---------------------------+
```

---

## 2. Configuración de Comunicación y CORS (Cross-Origin Resource Sharing)

Para permitir que el cliente React (corriendo por defecto en `http://localhost:5173` o `http://localhost:3000`) se comunique sin bloqueos de origen cruzado con la API Spring Boot (`http://localhost:8080`), se implementó la siguiente configuración en `SecurityConfig.java`:

- **Orígenes permitidos:** Patrones dinámicos `allowedOriginPatterns("*")`
- **Métodos HTTP:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- **Encabezados:** `Authorization`, `Content-Type`, `X-Requested-With`, `Accept`, `Origin`
- **Encabezados Expuestos:** `Authorization` (para lectura del JWT)
- **Credenciales:** `setAllowCredentials(true)`

---

## 3. Flujo de Autenticación Basada en Tokens JWT (IE3.3.1)

```
[ Usuario en Frontend ]
         |
         | 1. Ingresa correo y contraseña en /login
         v
[ React api.login() ] ------ POST /api/auth/login ------> [ Spring Boot AuthController ]
                                                                     |
                                                                     | 2. BCrypt valida contraseña
                                                                     | 3. JwtTokenProvider genera Token firmado (HS256)
                                                                     v
[ React guarda en localStorage ] <--- HTTP 200 { token, rol, ... } ---+
    - localStorage.setItem('token', token)
    - localStorage.setItem('currentUser', JSON.stringify(usuario))
         |
         | 4. Próximas solicitudes protegidas (ej: crear/editar/eliminar producto)
         v
[ React getAuthHeaders() ] ------ Headers: Authorization: Bearer {token} ------> [ JwtAuthenticationFilter ]
                                                                                          |
                                                                                          | 5. Valida firma y fecha expiración
                                                                                          | 6. Inyecta roles en SecurityContext
                                                                                          v
                                                                                [ Controller @PreAuthorize ]
```

### Características de Seguridad del Token JWT:
- **Algoritmo:** HMAC SHA-256 (`HS256`) con clave secreta criptográfica de 256 bits.
- **Claims incluidos:**
  - `sub`: Correo del usuario (identificador único).
  - `id`: Identificador numérico del usuario en base de datos.
  - `nombre`: Nombre completo del usuario para visualización.
  - `roles`: Rol asignado (`ROLE_CLIENTE` o `ROLE_ADMIN`).
  - `iat` y `exp`: Fecha de emisión y expiración (24 horas).

---

## 4. Persistencia de Sesión y Restricción de Acceso en Frontend (IE3.3.2 & IE3.3.3)

### A. Persistencia ante Recargas de Página
En `src/App.jsx` y `src/services/authService.js`:
- El estado del usuario `currentUser` se inicializa mediante función perezosa (lazy state) leyendo directamente desde `localStorage.getItem('currentUser')`.
- Al recargar el navegador (`F5`), el token JWT y la sesión del usuario se preservan intactos sin requerir un nuevo inicio de sesión.

### B. Control de Acceso por Roles (RBAC)
- **Ruta Protegida (`ProtectedRoute.jsx`):** Envuelve las rutas sensibles (`/admin`, `/admin/crear`, `/admin/editar/:id`).
- Si un usuario no autenticado o con rol `ROLE_CLIENTE` intenta acceder directamente escribiendo la URL `/admin`, es bloqueado y redirigido a `/login` o `/` con mensaje de alerta.
- En la interfaz del catálogo, los botones de administración sólo son accesibles para cuentas autorizadas.

---

## 5. Mapeo de Contratos de Datos (Modelos y DTOs)

| Entidad / DTO | Campos Frontend (React) | Campos Backend (Spring Boot) | Tipo de Dato |
|---|---|---|---|
| **Producto** | `id` | `id` | `String` (PK ej: "JM001") |
| | `nombre` | `nombre` | `String` |
| | `categoria` | `categoria` | `String` |
| | `precio` | `precio` | `Double` (mayor a 0) |
| | `img` | `img` | `String` (Ruta o URL) |
| | `stock` (opcional) | `stock` | `Integer` |
| **Usuario / Login** | `correo` | `correo` | `String` (Email válido) |
| | `contrasena` | `contrasena` | `String` (Hashed BCrypt) |
| **Usuario / Registro** | `nombre` | `nombre` | `String` (Hasta 50 caracteres) |
| | `telefono` | `telefono` | `String` (Formato móvil chileno) |
| | `region` | `region` | `String` |
| | `comuna` | `comuna` | `String` |
| | `rol` | `rol` | `Enum` (`ROLE_CLIENTE`, `ROLE_ADMIN`) |
| **Pedido / Carrito** | `items` | `items` | `List<PedidoItemDTO>` |
| | `cupon` | `cupon` | `String` (Ej: "DUOC20" -> -20%) |
| | `total` | `total` | `Double` |

---

## 6. Procedimiento de Verificación de Integración Paso a Paso

1. **Iniciar Backend:**
   ```powershell
   cd c:\Users\PC\Desktop\levelup-backend\levelup-backend
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   .\mvnw.cmd spring-boot:run
   ```
2. **Verificar Swagger:**
   Abrir navegador en `http://localhost:8080/swagger-ui.html`. Probar endpoint `GET /api/productos`.
3. **Iniciar Frontend:**
   ```powershell
   cd "c:\Users\PC\Desktop\LevelUp2JEJE (1)\LevelUp2JEJE\LevelUp"
   npm run dev
   ```
4. **Probar Login y Token JWT:**
   - Iniciar sesión con `admin@levelup.cl` / `Admin123!`.
   - Inspeccionar la consola del navegador (`F12 -> Application -> Local Storage`).
   - Verificar la presencia de la clave `token` con el JWT codificado y `currentUser` con el rol `ROLE_ADMIN`.
5. **Probar Operaciones CRUD:**
   - Crear un nuevo producto desde la interfaz de administración.
   - Verificar que se guarda en la base de datos MySQL y se refleja en el catálogo de inicio.
