-- Script de creacion de Base de Datos y Tablas para LevelUp Gamer
-- Duoc UC - DSY1104 Desarrollo Fullstack II

CREATE DATABASE IF NOT EXISTS levelup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE levelup_db;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(30),
    region VARCHAR(100),
    comuna VARCHAR(100),
    rol VARCHAR(30) NOT NULL DEFAULT 'ROLE_CLIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DOUBLE NOT NULL,
    img VARCHAR(255) NOT NULL,
    descripcion TEXT,
    stock INT DEFAULT 10
);

-- Tabla de Pedidos / Compras
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    nombre_cliente VARCHAR(100),
    correo_cliente VARCHAR(150),
    fecha DATETIME NOT NULL,
    total DOUBLE NOT NULL,
    descuento DOUBLE DEFAULT 0,
    cupon VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Detalle de Pedidos
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id VARCHAR(50) NOT NULL,
    nombre_producto VARCHAR(150) NOT NULL,
    precio_unitario DOUBLE NOT NULL,
    cantidad INT NOT NULL,
    subtotal DOUBLE NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);
