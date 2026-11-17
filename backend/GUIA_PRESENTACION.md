# Guía de Defensa y Presentación Oral (Situación Evaluativa 2 - 60%)
**Asignatura:** DSY1104 - Desarrollo Fullstack II (Evaluación Parcial N° 3)  
**Institución:** Duoc UC  
**Proyecto:** LevelUp Gamer  

Esta guía contiene la respuesta técnica exacta, justificación y código de respaldo para responder a cada uno de los 6 indicadores evaluados en la presentación individual con la máxima calificación (100% - Nivel "Muy Buen Desempeño").

---

### Indicador 1: Conexión a Base de Datos, Lógica de Negocio y Modelos (IE3.1.2 - 12%)
> **Pregunta esperada del docente:** *"Explica cómo conectaron el backend a la base de datos MySQL, cómo diseñaron los modelos de datos y qué lógica de negocio implementaron."*

**Respuesta ejemplar recomendada:**
> *"Para este proyecto implementamos una conexión robusta a **MySQL 8** mediante **Spring Data JPA y Hibernate**, configurada en `application.properties` con parámetros que aseguran compatibilidad horaria (`serverTimezone=America/Santiago`), creación automática del esquema si no existe (`createDatabaseIfNotExist=true`) y generación de tablas automática con `ddl-auto=update`.*
>
> *Los modelos de datos reflejan fielmente el negocio de la tienda de videojuegos:*
> 1. *La entidad `Producto` utiliza como clave primaria un código alfanumérico estandarizado (`JM001`, `AC001`, etc.), nombre, categoría, precio numérico positivo, imagen y control de inventario (`stock`).*
> 2. *La entidad `Usuario` cuenta con restricciones de integridad como correo único (`unique = true`), contraseñas cifradas unidireccionalmente con `BCryptPasswordEncoder` y un enumerado `Role` (`ROLE_CLIENTE`, `ROLE_ADMIN`).*
> 3. *La entidad `Pedido` y `DetallePedido` representan la lógica del checkout, calculando subtotales por producto y aplicando reglas de negocio como el 20% de descuento automático al validar el cupón `DUOC20`.*
>
> *Toda la lógica de negocio se encuentra desacoplada en la capa de servicios (`ProductoServiceImpl`, `AuthServiceImpl`, `PedidoServiceImpl`), asegurando transaccionalidad con `@Transactional` y validación estricta de datos con Bean Validation."*

---

### Indicador 2: Servicios de API REST en Spring Boot y Swagger (IE3.2.3 - 12%)
> **Pregunta esperada del docente:** *"¿Cómo implementaron la API REST con Spring Boot, qué endpoints CRUD crearon y cómo documentaron todo en Swagger?"*

**Respuesta ejemplar recomendada:**
> *"Implementamos una arquitectura RESTful estándar utilizando controladores anotados con `@RestController` y `@RequestMapping`:*
> - *Para el catálogo de productos (`/api/productos`), creamos las 5 operaciones CRUD fundamentales:*
>   - *`GET /api/productos`: Lectura masiva con soporte de búsqueda por texto o filtrado por categoría.*
>   - *`GET /api/productos/{id}`: Lectura individual por ID.*
>   - *`POST /api/productos`: Creación de producto validando el DTO con `@Valid`.*
>   - *`PUT /api/productos/{id}`: Modificación de producto existente.*
>   - *`DELETE /api/productos/{id}`: Eliminación física del registro.*
> - *Complementamos con endpoints de autenticación (`/api/auth/login`, `/api/auth/register`) y de compras (`/api/pedidos`).*
>
> *La documentación se generó automáticamente utilizando **SpringDoc OpenAPI 3**. Configuramos `OpenApiConfig.java` para exponer la interfaz visual interactiva en `/swagger-ui.html`. Además, integramos el esquema de seguridad `BearerAuth` con JWT en Swagger, lo que permite autenticarse directamente en la UI mediante el botón 'Authorize' y probar los endpoints protegidos con respuestas en tiempo real."*

---

### Indicador 3: Integración Backend y Frontend mediante API REST (IE3.2.4 - 10%)
> **Pregunta esperada del docente:** *"¿Cómo aseguraron la integración efectiva y el flujo de datos eficiente entre el frontend en React y el backend en Spring Boot?"*

**Respuesta ejemplar recomendada:**
> *"La integración se logró estableciendo un protocolo de comunicación cliente-servidor desacoplado mediante HTTP y JSON:*
> 1. *En el backend, configuramos una política de **CORS** completa en `SecurityConfig.java` utilizando `CorsConfigurationSource`, permitiendo las peticiones desde el puerto de Vite React (`http://localhost:5173`), autorizando los métodos HTTP correspondientes y exponiendo los encabezados de autorización.*
> 2. *En el frontend, creamos una capa de servicios centralizada (`src/services/api.js`), la cual utiliza la API nativa `fetch` con funciones asíncronas (`async/await`) para consumir los endpoints REST.*
> 3. *Los contratos de datos (Data Transfer Objects) están estrictamente sincronizados: los campos de producto (`id`, `nombre`, `categoria`, `precio`, `img`) y de usuario coinciden exactamente en ambas capas, eliminando transformaciones innecesarias y optimizando el flujo de datos.*
> 4. *Implementamos manejo centralizado de excepciones con `@RestControllerAdvice` (`GlobalExceptionHandler`), asegurando que cualquier error devuelva un JSON estructurado con mensajes claros para el usuario final."*

---

### Indicador 4: Autenticación con Roles y JWT en Backend (IE3.3.4 - 10%)
> **Pregunta esperada del docente:** *"Explica cómo funciona la autenticación con JWT y cómo aseguran el acceso a recursos según el rol del usuario."*

**Respuesta ejemplar recomendada:**
> *"Implementamos seguridad basada en **Spring Security 6** con autenticación sin estado (**Stateless Session**) mediante **JSON Web Tokens (JJWT 0.12.6)**:*
> 1. *Cuando el usuario envía sus credenciales al endpoint `/api/auth/login`, el `AuthenticationManager` valida el correo y la contraseña comparando el hash de BCrypt.*
> 2. *Tras validar las credenciales, `JwtTokenProvider` genera un token firmado criptográficamente con el algoritmo **HMAC SHA-256 (`HS256`)** que incluye como claims el ID del usuario, su correo, nombre y sus roles (`ROLE_CLIENTE` o `ROLE_ADMIN`), con un tiempo de expiración de 24 horas.*
> 3. *Para proteger los recursos, creamos `JwtAuthenticationFilter`, un filtro de tipo `OncePerRequestFilter` que intercepta cada solicitud entrante, extrae el token del header `Authorization: Bearer <token>`, valida la firma y vigencia del token y, si es correcto, carga la identidad del usuario en el `SecurityContextHolder`.*
> 4. *A nivel de endpoints, aplicamos seguridad granular:*
>    - *Públicos: lectura de productos (`GET /api/productos`) y endpoints de login/registro.*
>    - *Protegidos por rol: las operaciones de creación, edición y eliminación de productos (`POST`, `PUT`, `DELETE /api/productos`) requieren obligatoriamente la autoridad `ROLE_ADMIN` mediante `@PreAuthorize("hasAuthority('ROLE_ADMIN')")`."*

---

### Indicador 5: Gestión de Sesión y Persistencia en Frontend (IE3.3.5 - 8%)
> **Pregunta esperada del docente:** *"¿Cómo manejan la sesión en el frontend para que se mantenga activa y segura incluso si el usuario recarga la página?"*

**Respuesta ejemplar recomendada:**
> *"En el frontend en React implementamos un sistema de persistencia basado en `localStorage` y React State:*
> 1. *Al autenticarse exitosamente contra el endpoint `/api/auth/login`, el frontend recibe el token JWT y los datos del usuario, almacenando el token bajo la clave `token` y el perfil bajo `currentUser` en `localStorage`.*
> 2. *Para garantizar la persistencia ante recargas de página (`F5`), el estado `currentUser` en `App.jsx` se inicializa mediante lazy evaluation leyendo el valor persistido en `localStorage` al momento de montar la aplicación.*
> 3. *En cada solicitud hacia endpoints protegidos, el interceptor `getAuthHeaders()` en `src/services/api.js` recupera automáticamente el token de `localStorage` y lo adjunta en el encabezado `Authorization: Bearer ${token}`.*
> 4. *Al cerrar sesión, la función `handleLogout` elimina de forma segura ambas claves (`token` y `currentUser`) y reinicia el estado de la aplicación."*

---

### Indicador 6: Restricciones de Acceso a Funcionalidades en Frontend (IE3.3.6 - 8%)
> **Pregunta esperada del docente:** *"¿Cómo aseguran en el frontend que sólo los usuarios con permisos adecuados puedan acceder a interfaces y acciones de administrador?"*

**Respuesta ejemplar recomendada:**
> *"Implementamos un control de acceso por roles en múltiples niveles del frontend:*
> 1. *A nivel de rutas, creamos el componente **`ProtectedRoute.jsx`**, el cual verifica tanto que el usuario haya iniciado sesión como que posea el rol `ROLE_ADMIN`. Si un cliente regular o un usuario anónimo intenta acceder directamente por URL a `/admin`, `/admin/crear` o `/admin/editar/:id`, el componente intercepta la navegación, muestra una alerta de acceso denegado y redirige al inicio.*
> 2. *A nivel de interfaz gráfica y experiencia de usuario (UX), en el `Navbar.jsx` y en las vistas de catálogo, el botón hacia el panel de administración y los controles de gestión de inventario sólo se habilitan o renderizan si el rol del usuario autenticado corresponde a `ROLE_ADMIN`.*
> 3. *Esto se complementa con la seguridad del backend, de modo que si alguien intentara vulnerar el frontend modificando el almacenamiento local, el backend rechazará inmediatamente cualquier petición con un código HTTP `401 Unauthorized` o `403 Forbidden` al validar el token criptográfico firmado."*
