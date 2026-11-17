# LevelUp Gamer - Backend API REST (Spring Boot)

Backend oficial para la plataforma e-commerce **LevelUp Gamer**, desarrollado para la asignatura **DSY1104 - Desarrollo Fullstack II (Evaluación Parcial N° 3, Duoc UC)**.

---

## 🛠️ Tecnologías y Stack Utilizado

- **Lenguaje:** Java 17 LTS
- **Framework:** Spring Boot 3.4+ / 4.x
- **Persistencia & ORM:** Spring Data JPA / Hibernate
- **Base de Datos:** MySQL 8.0 (con soporte H2 en perfil test)
- **Seguridad & Auth:** Spring Security 6 + JSON Web Tokens (JJWT 0.12.6) con algoritmo HMAC SHA-256
- **Validaciones:** Hibernate Validator / Jakarta Bean Validation (`@Valid`)
- **Documentación API:** SpringDoc OpenAPI 3 UI (Swagger UI)
- **Pruebas:** JUnit 5, Mockito, MockMvc

---

## 🗄️ Modelo de Datos y Base de Datos (IE3.1.1)

El backend se conecta a una base de datos MySQL llamada `levelup_db`.

### 1. Entidades Principales

- **`Usuario` (`usuarios`):**
  - `id` (BIGINT, PK auto-incremental)
  - `nombre` (VARCHAR, no nulo)
  - `correo` (VARCHAR, único, formato email)
  - `contrasena` (VARCHAR, encriptada con BCrypt)
  - `telefono` (VARCHAR, validación móvil chileno)
  - `region`, `comuna` (VARCHAR)
  - `rol` (ENUM: `ROLE_CLIENTE`, `ROLE_ADMIN`)
  - `fecha_creacion` (TIMESTAMP)

- **`Producto` (`productos`):**
  - `id` (VARCHAR(50), PK ej: `JM001`, `AC001`, `CO001`)
  - `nombre` (VARCHAR(150), no nulo)
  - `categoria` (VARCHAR(100), no nulo)
  - `precio` (DOUBLE, mayor a 0)
  - `img` (VARCHAR(255), ruta o URL de imagen)
  - `descripcion` (TEXT)
  - `stock` (INT, inventario disponible)

- **`Pedido` (`pedidos`) y `DetallePedido` (`detalle_pedidos`):**
  - Manejo de órdenes generadas desde el carrito de compras.
  - Lógica de negocio para aplicar cupón de descuento (`DUOC20` -> 20% de descuento).
  - Cálculo de subtotal, descuento aplicado y total final.

---

## 🚀 Puesta en Marcha y Configuración

### 1. Requisitos Previos
- Java 17 instalado (ej: `C:\Program Files\Java\jdk-17`)
- Servidor MySQL 8.0 en ejecución en el puerto 3306

### 2. Configuración de Base de Datos
En `src/main/resources/application.properties`, configure sus credenciales de MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/levelup_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=America/Santiago&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```
*(Si su contraseña de MySQL es distinta, modifique `spring.datasource.password` o defina la variable de entorno `DB_PASSWORD`)*.

### 3. Ejecución del Backend
Abra una terminal en la carpeta del backend y ejecute:
```powershell
# En Windows (PowerShell):
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
.\mvnw.cmd spring-boot:run
```

### 4. Carga Inicial de Datos Automática (`DataInitializer`)
Al iniciar la aplicación por primera vez, el sistema precarga automáticamente:
- **Usuario Administrador:**
  - Correo: `admin@levelup.cl`
  - Contraseña: `Admin123!`
  - Rol: `ROLE_ADMIN`
- **Usuario Cliente (Prueba):**
  - Correo: `cliente@levelup.cl`
  - Contraseña: `User123!`
  - Rol: `ROLE_CLIENTE`
- **Catálogo de 9 productos oficiales** (Catan, Carcassonne, PS5, Xbox Series X Controller, Silla Gamer Titan, etc.).

---

## 📖 Documentación Interactiva Swagger (IE3.2.1)

Una vez iniciado el servidor, ingrese a la interfaz Swagger UI:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

### Autenticación en Swagger:
1. Diríjase al endpoint `POST /api/auth/login` y ejecútelo con `admin@levelup.cl` y `Admin123!`.
2. Copie el valor del campo `token`.
3. Haga clic en el botón verde **"Authorize"** en la parte superior derecha de Swagger.
4. Pegue el token y haga clic en **Authorize**. Todos los endpoints protegidos para Administrador quedarán habilitados para prueba directa.

---

## 📡 Endpoints del API REST

### 1. Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Autentica con correo y contraseña. Retorna JWT. |
| `POST` | `/api/auth/register` | Público | Registra nuevo usuario (cliente) con validaciones. |
| `GET` | `/api/auth/me` | Autenticado | Retorna el perfil del usuario a partir del JWT. |

### 2. Catálogo de Productos (`/api/productos`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/productos` | Público | Lista todos los productos (soporta filtros `?categoria=` y `?search=`). |
| `GET` | `/api/productos/{id}` | Público | Retorna un producto por su código alfanumérico. |
| `POST` | `/api/productos` | `ROLE_ADMIN` | Crea un nuevo producto en el catálogo. |
| `PUT` | `/api/productos/{id}` | `ROLE_ADMIN` | Modifica los datos de un producto existente. |
| `DELETE` | `/api/productos/{id}` | `ROLE_ADMIN` | Elimina un producto del catálogo. |

### 3. Pedidos y Checkout (`/api/pedidos`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/pedidos` | Público/Auth | Procesa la compra del carrito, aplica cupón `DUOC20` y registra la orden. |
| `GET` | `/api/pedidos` | Autenticado | Consulta el historial de órdenes registradas. |
| `GET` | `/api/pedidos/{id}` | Autenticado | Obtiene el detalle desglosado de una orden. |

### 4. Gestión de Usuarios (`/api/usuarios`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/usuarios` | `ROLE_ADMIN` | Listado completo de usuarios registrados. |
| `GET` | `/api/usuarios/{id}` | `ROLE_ADMIN` | Detalle de un usuario específico. |
| `PATCH` | `/api/usuarios/{id}/rol`| `ROLE_ADMIN` | Actualiza el rol de un usuario (`ROLE_ADMIN` / `ROLE_CLIENTE`). |

---

## 🧪 Ejecución de Pruebas Unitarias y de Integración

El proyecto cuenta con una suite completa de pruebas unitarias y de integración que validan servicios, controladores, validaciones y reglas de negocio:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
.\mvnw.cmd test
```
*Todas las pruebas se ejecutan de manera aislada utilizando una base de datos en memoria H2, garantizando el 100% de éxito en cualquier entorno sin depender del estado de MySQL.*
