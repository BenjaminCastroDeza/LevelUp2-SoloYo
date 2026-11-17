# Manual de Usuario - Plataforma LevelUp Gamer
**Proyecto:** LevelUp Gamer E-Commerce  
**Asignatura:** DSY1104 - Desarrollo Fullstack II (Evaluación Parcial N° 3)  
**Institución:** Duoc UC  

---

## 1. Introducción
El presente manual describe las funcionalidades, accesos y operaciones disponibles en la tienda online **LevelUp Gamer**, tanto para usuarios clientes como para administradores del catálogo.

---

## 2. Cuentas de Acceso Preconfiguradas

Para facilitar la evaluación y revisión del proyecto, el sistema cuenta con dos usuarios creados automáticamente al iniciar el backend:

| Rol | Correo Electrónico | Contraseña | Permisos |
|---|---|---|---|
| **Administrador** | `admin@levelup.cl` | `Admin123!` | Acceso total al Panel de Administración, crear, editar y eliminar productos, gestionar usuarios y ver órdenes. |
| **Cliente** | `cliente@levelup.cl` | `User123!` | Navegar catálogo, agregar productos al carrito, aplicar cupones de descuento y procesar compras. |

---

## 3. Guía de Operaciones del Cliente

### A. Navegación por el Catálogo
1. Ingrese a la página de inicio (`http://localhost:5173/`).
2. En la sección **"Catálogo Destacado"** se exhiben los artículos disponibles con su imagen oficial, nombre, categoría y precio en pesos chilenos (CLP).
3. Para agregar un ítem al carrito de compras, haga clic en el botón **"Agregar"** en la tarjeta del producto. Un mensaje notificará la acción y el contador de la barra superior aumentará inmediatamente.

### B. Gestión del Carrito de Compras
1. Haga clic en el botón superior **"Cart (X)"** para acceder a la vista de compras (`/carrito`).
2. Podrá aumentar o disminuir la cantidad de cada producto con los controles `+` y `-`.
3. Para aplicar un cupón de descuento promocional, ingrese `DUOC20` en el campo correspondiente y presione **"APLICAR"**. El sistema calculará automáticamente una rebaja del 20% sobre el total.
4. Presione el botón **"PAGAR"** para procesar la orden de compra.

### C. Registro de Nueva Cuenta
1. En la barra de navegación o desde la pantalla de login, seleccione **"Registrar usuario aquí"**.
2. Complete los campos requeridos:
   - **Nombre Completo:** Sólo letras y espacios (máximo 50 caracteres).
   - **Correo Electrónico:** Formato de correo válido y único en el sistema.
   - **Contraseña:** Mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo especial.
   - **Teléfono:** Opcional, formato móvil chileno (+56 9 1234 5678).
   - **Región y Comuna:** Seleccione su región y comuna correspondiente.
3. Presione **"Registrar"**. El backend registrará la cuenta y redirigirá al inicio de sesión.

---

## 4. Guía de Operaciones del Administrador

### A. Acceso al Panel de Administración
1. Inicie sesión con la cuenta de administrador:
   - Correo: `admin@levelup.cl`
   - Contraseña: `Admin123!`
2. En la barra de navegación superior, haga clic en el botón amarillo **"Admin"**.
3. Se desplegará la tabla con el listado completo de productos registrados en la base de datos MySQL.

### B. Crear un Nuevo Producto
1. Dentro del Panel de Administración, haga clic en el botón verde **"Nuevo Producto"**.
2. Complete los datos del formulario:
   - **Código / ID:** Ingrese un código único (ej: `JM003`, `AC005`).
   - **Nombre:** Nombre comercial del producto.
   - **Categoría:** Seleccione una categoría de la lista desplegable (Juegos de Mesa, Consolas, Accesorios, etc.).
   - **Precio:** Valor numérico mayor a 0 en CLP.
   - **Ruta o URL de Imagen:** Ruta local (ej: `/imagenes/teclado.jpg`) o URL web.
3. Presione **"Crear Producto"**. El producto se guardará en la base de datos y aparecerá de inmediato en el catálogo de clientes.

### C. Modificar un Producto
1. En la fila del producto deseado dentro de la tabla de administración, haga clic en **"Editar"**.
2. Actualice los campos que requiera modificar (el ID permanece bloqueado como clave primaria).
3. Presione **"Guardar Cambios"**.

### D. Eliminar un Producto
1. En la tabla de administración, haga clic en el botón rojo **"Eliminar"**.
2. El sistema solicitará confirmación antes de dar de baja el registro de la base de datos.

---

## 5. Pruebas y Exploración con Swagger UI

Para probar los endpoints REST directamente desde el navegador:
1. Abra `http://localhost:8080/swagger-ui.html`.
2. Para probar endpoints protegidos (POST, PUT, DELETE de `/api/productos`):
   - Ejecute `POST /api/auth/login` con credenciales de administrador.
   - Copie el valor del token retornado.
   - Presione el botón **"Authorize"** en la esquina superior derecha y pegue el token.
   - Ejecute las consultas deseadas y observe el código de estado HTTP (200, 201, 400, 401, 403).
