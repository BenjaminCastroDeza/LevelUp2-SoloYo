# Backend LevelUp Gamer - Arquitectura de Microservicios

Este directorio contiene los dos microservicios Spring Boot independientes que componen el backend de **LevelUp Gamer**:

---

## 🏗️ Estructura de Microservicios

```
backend/
├── levelup-MSlogin/        # Microservicio 1: Autenticación, Usuarios, Roles y JWT (Puerto 8081)
└── levelup-MSproductos/    # Microservicio 2: Catálogo de Productos, Stock y Pedidos (Puerto 8082)
```

---

## 🚀 1. Microservicio 1: Auth & Usuarios (`levelup-MSlogin`)
- **Puerto:** `8081`
- **Base de Datos:** MySQL `levelup_auth_db`
- **Swagger UI:** [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)
- **Ejecución:**
  ```powershell
  cd backend/levelup-MSlogin
  .\mvnw.cmd spring-boot:run
  ```

---

## 🛒 2. Microservicio 2: Tienda (`levelup-MSproductos`)
- **Puerto:** `8082`
- **Base de Datos:** MySQL `levelup_tienda_db`
- **Swagger UI:** [http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html)
- **Ejecución:**
  ```powershell
  cd backend/levelup-MSproductos
  .\mvnw.cmd spring-boot:run
  ```

---

Para detalles completos de endpoints, reglas de negocio y configuración, consulta [INTEGRACION_MICROSERVICIOS.md](../INTEGRACION_MICROSERVICIOS.md).
