
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS 
    reportes_ventas, logs_acceso, historial_productos, historial_precios,
    facturas, detalle_pedidos, pedidos, recetas, inventario, productos,
    clientes, historial_permisos, roles_permisos, tokens_2fa, usuarios,
    categorias, mesas, permisos, roles;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `roles` (
   `id_rol` INT AUTO_INCREMENT PRIMARY KEY,
   `nombre_rol` VARCHAR(50) NOT NULL UNIQUE,
   `descripcion` TEXT
) ENGINE=InnoDB;

CREATE TABLE `permisos` (
   `id_permiso` INT AUTO_INCREMENT PRIMARY KEY,
   `nombre_permiso` VARCHAR(100) NOT NULL UNIQUE,
   `descripcion` TEXT
) ENGINE=InnoDB;

CREATE TABLE `categorias` (
   `id_categoria` INT AUTO_INCREMENT PRIMARY KEY,
   `nombre_categoria` VARCHAR(100) NOT NULL,
   `descripcion` TEXT,
   `tipo` ENUM('comida', 'bebida', 'insumo') NOT NULL,
   INDEX `idx_categoria_tipo` (`tipo`)
) ENGINE=InnoDB;

CREATE TABLE `mesas` (
   `id_mesa` INT AUTO_INCREMENT PRIMARY KEY,
   `numero_mesa` INT NOT NULL UNIQUE,
   `capacidad` INT NOT NULL,
   `estado` ENUM('disponible', 'ocupada', 'reservada', 'mantenimiento') DEFAULT 'disponible',
   `ubicacion` VARCHAR(100),
   INDEX `idx_mesa_estado` (`estado`),
   INDEX `idx_mesa_numero` (`numero_mesa`)
) ENGINE=InnoDB;

CREATE TABLE `usuarios` (
   `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
   `nombre_usuario` VARCHAR(50) NOT NULL UNIQUE,
   `contrasena` VARCHAR(255) NOT NULL,
   `email` VARCHAR(100),
   `id_rol` INT NOT NULL,
   `estado` ENUM('activo', 'inactivo') DEFAULT 'activo',
   `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `codigo_2fa` VARCHAR(6) DEFAULT NULL,
   `fecha_expiracion_2fa` DATETIME DEFAULT NULL,
   FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`),
   INDEX `idx_usuario_rol` (`id_rol`),
   INDEX `idx_usuario_estado` (`estado`)
) ENGINE=InnoDB;

CREATE TABLE `tokens_2fa` (
   `id_token` INT AUTO_INCREMENT PRIMARY KEY,
   `id_usuario` INT NOT NULL,
   `token` VARCHAR(10) NOT NULL,
   `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `fecha_expiracion` DATETIME NOT NULL,
   `utilizado` BOOLEAN DEFAULT FALSE,
   `tipo` ENUM('login', 'recuperacion', 'admin') NOT NULL,
   FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`),
   INDEX `idx_token_usuario` (`id_usuario`),
   INDEX `idx_token_expiracion` (`fecha_expiracion`)
) ENGINE=InnoDB;

CREATE TABLE `roles_permisos` (
   `id_rol_permiso` INT AUTO_INCREMENT PRIMARY KEY,
   `id_rol` INT NOT NULL,
   `id_permiso` INT NOT NULL,
   FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`),
   FOREIGN KEY (`id_permiso`) REFERENCES `permisos`(`id_permiso`),
   UNIQUE KEY `unique_rol_permiso` (`id_rol`, `id_permiso`),
   INDEX `idx_rol_permiso` (`id_rol`)
) ENGINE=InnoDB;

CREATE TABLE `historial_permisos` (
   `id_historial` INT AUTO_INCREMENT PRIMARY KEY,
   `id_usuario_administrador` INT NOT NULL,
   `id_usuario_afectado` INT NOT NULL,
   `id_permiso` INT NOT NULL,
   `accion` ENUM('asignado', 'revocado') NOT NULL,
   `fecha_accion` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `motivo` TEXT,
   FOREIGN KEY (`id_usuario_administrador`) REFERENCES `usuarios`(`id_usuario`),
   FOREIGN KEY (`id_usuario_afectado`) REFERENCES `usuarios`(`id_usuario`),
   FOREIGN KEY (`id_permiso`) REFERENCES `permisos`(`id_permiso`),
   INDEX `idx_historial_fecha` (`fecha_accion`)
) ENGINE=InnoDB;

CREATE TABLE `clientes` (
   `id_cliente` INT AUTO_INCREMENT PRIMARY KEY,
   `nombre` VARCHAR(100) NOT NULL,
   `telefono` VARCHAR(20),
   `email` VARCHAR(100),
   `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `id_usuario` INT NULL,
   FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`),
   INDEX `idx_cliente_nombre` (`nombre`)
) ENGINE=InnoDB;

CREATE TABLE `productos` (
   `id_producto` INT AUTO_INCREMENT PRIMARY KEY,
   `nombre_producto` VARCHAR(100) NOT NULL,
   `descripcion` TEXT,
   `precio` DECIMAL(10,2) NOT NULL,
   `id_categoria` INT NOT NULL,
   `disponible` BOOLEAN DEFAULT TRUE,
   `imagen_url` VARCHAR(255),
   `tiempo_preparacion` INT DEFAULT 15,
   `ingredientes_principales` TEXT,
   `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id_categoria`),
   INDEX `idx_producto_categoria` (`id_categoria`),
   INDEX `idx_producto_disponible` (`disponible`),
   INDEX `idx_producto_nombre` (`nombre_producto`)
) ENGINE=InnoDB;

CREATE TABLE `inventario` (
   `id_inventario` INT AUTO_INCREMENT PRIMARY KEY,
   `id_producto` INT NOT NULL,
   `cantidad` INT NOT NULL,
   `stock_minimo` INT DEFAULT 0,
   `fecha_actualizacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`)
) ENGINE=InnoDB;

CREATE TABLE `recetas` (
   `id_receta` INT AUTO_INCREMENT PRIMARY KEY,
   `id_producto` INT NOT NULL,
   `id_inventario` INT NOT NULL,
   `cantidad_requerida` DECIMAL(8,3) NOT NULL,
   `unidad_medida` VARCHAR(20) NOT NULL,
   `instrucciones` TEXT,
   `fecha_actualizacion` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
   FOREIGN KEY (`id_inventario`) REFERENCES `inventario`(`id_inventario`),
   INDEX `idx_receta_producto` (`id_producto`),
   INDEX `idx_receta_inventario` (`id_inventario`)
) ENGINE=InnoDB;

CREATE TABLE `pedidos` (
   `id_pedido` INT AUTO_INCREMENT PRIMARY KEY,
   `id_mesa` INT NOT NULL,
   `id_cliente` INT,
   `id_usuario` INT NOT NULL,
   `estado` ENUM('pendiente', 'confirmado', 'preparacion', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
   `total` DECIMAL(10,2) DEFAULT 0,
   `fecha_pedido` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `notas` TEXT,
   FOREIGN KEY (`id_mesa`) REFERENCES `mesas`(`id_mesa`),
   FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`),
   FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`),
   INDEX `idx_pedido_fecha` (`fecha_pedido`),
   INDEX `idx_pedido_estado` (`estado`)
) ENGINE=InnoDB;

CREATE TABLE `detalle_pedidos` (
   `id_detalle` INT AUTO_INCREMENT PRIMARY KEY,
   `id_pedido` INT NOT NULL,
   `id_producto` INT NOT NULL,
   `cantidad` INT NOT NULL,
   `precio_unitario` DECIMAL(10,2) NOT NULL,
   `subtotal` DECIMAL(10,2) NOT NULL,
   `notas` TEXT,
   FOREIGN KEY (`id_pedido`) REFERENCES `pedidos`(`id_pedido`),
   FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
   INDEX `idx_detalle_pedido` (`id_pedido`)
) ENGINE=InnoDB;

CREATE TABLE `facturas` (
   `id_factura` INT AUTO_INCREMENT PRIMARY KEY,
   `id_pedido` INT NOT NULL,
   `numero_factura` VARCHAR(50) UNIQUE NOT NULL,
   `fecha_emision` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `subtotal` DECIMAL(10,2) NOT NULL,
   `impuestos` DECIMAL(10,2) NOT NULL,
   `total` DECIMAL(10,2) NOT NULL,
   `estado` ENUM('pendiente', 'pagada', 'anulada') DEFAULT 'pendiente',
   `metodo_pago` ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
   FOREIGN KEY (`id_pedido`) REFERENCES `pedidos`(`id_pedido`),
   INDEX `idx_factura_numero` (`numero_factura`),
   INDEX `idx_factura_fecha` (`fecha_emision`)
) ENGINE=InnoDB;

CREATE TABLE `historial_precios` (
   `id_historial_precio` INT AUTO_INCREMENT PRIMARY KEY,
   `id_producto` INT NOT NULL,
   `precio_anterior` DECIMAL(10,2) NOT NULL,
   `precio_nuevo` DECIMAL(10,2) NOT NULL,
   `fecha_cambio` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `id_usuario_cambio` INT NOT NULL,
   `motivo` TEXT,
   FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
   FOREIGN KEY (`id_usuario_cambio`) REFERENCES `usuarios`(`id_usuario`),
   INDEX `idx_historial_producto` (`id_producto`),
   INDEX `idx_historial_fecha` (`fecha_cambio`)
) ENGINE=InnoDB;

CREATE TABLE `historial_productos` (
   `id_historial_producto` INT AUTO_INCREMENT PRIMARY KEY,
   `id_producto` INT NOT NULL,
   `campo_modificado` VARCHAR(50) NOT NULL,
   `valor_anterior` TEXT,
   `valor_nuevo` TEXT,
   `fecha_modificacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `id_usuario_modificacion` INT NOT NULL,
   FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
   FOREIGN KEY (`id_usuario_modificacion`) REFERENCES `usuarios`(`id_usuario`),
   INDEX `idx_historial_prod_fecha` (`fecha_modificacion`)
) ENGINE=InnoDB;

CREATE TABLE `logs_acceso` (
   `id_log` INT AUTO_INCREMENT PRIMARY KEY,
   `id_usuario` INT NOT NULL,
   `fecha_acceso` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `ip_address` VARCHAR(45),
   `user_agent` TEXT,
   `accion` VARCHAR(100) NOT NULL,
   `resultado` ENUM('exitoso', 'fallido') DEFAULT 'exitoso',
   FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`),
   INDEX `idx_logs_fecha` (`fecha_acceso`),
   INDEX `idx_logs_usuario` (`id_usuario`)
) ENGINE=InnoDB;

CREATE TABLE `reportes_ventas` (
   `id_reporte` INT AUTO_INCREMENT PRIMARY KEY,
   `fecha_reporte` DATE NOT NULL,
   `total_ventas` DECIMAL(12,2) NOT NULL,
   `total_pedidos` INT NOT NULL,
   `producto_mas_vendido` VARCHAR(100),
   `mesa_mas_utilizada` INT,
   `promedio_ticket` DECIMAL(10,2),
   `fecha_generacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
   INDEX `idx_reporte_fecha` (`fecha_reporte`)
) ENGINE=InnoDB;

-- DATOS INICIALES

-- 1. Insertar roles básicos
INSERT INTO `roles` (`nombre_rol`, `descripcion`) VALUES
('admin', 'Administrador del sistema con todos los permisos'),
('mesero', 'Personal que toma pedidos y atende mesas'),
('cocina', 'Personal de cocina y preparación'),
('cajero', 'Personal de caja y facturación');

-- 2. Insertar permisos básicos
INSERT INTO `permisos` (`nombre_permiso`, `descripcion`) VALUES
('gestion_usuarios', 'Crear, editar y eliminar usuarios'),
('gestion_productos', 'Gestionar productos y menú'),
('gestion_inventario', 'Control de inventario'),
('tomar_pedidos', 'Tomar y gestionar pedidos'),
('ver_reportes', 'Acceso a reportes y estadísticas'),
('gestion_caja', 'Facturación y cierre de caja');

-- 3. Insertar categorías de productos
INSERT INTO `categorias` (`nombre_categoria`, `descripcion`, `tipo`) VALUES
('Entradas', 'Platos para comenzar la comida', 'comida'),
('Platos Fuertes', 'Platos principales', 'comida'),
('Postres', 'Dulces y postres', 'comida'),
('Bebidas Frías', 'Refrescos, jugos, aguas', 'bebida'),
('Bebidas Calientes', 'Café, té, chocolate', 'bebida'),
('Licores', 'Bebidas alcohólicas', 'bebida');

-- 4. Insertar mesas
INSERT INTO `mesas` (`numero_mesa`, `capacidad`, `ubicacion`) VALUES
(1, 4, 'Zona interior'),
(2, 4, 'Zona interior'),
(3, 6, 'Zona exterior'),
(4, 6, 'Zona exterior'),
(5, 2, 'Zona barra'),
(6, 8, 'Zona familiar');

-- 5. Insertar usuario administrador (CON CONTRASEÑAS SIMPLES PARA PRUEBA)
INSERT INTO `usuarios` (`nombre_usuario`, `contrasena`, `email`, `id_rol`, `estado`) VALUES
('admin', 'admin123', 'admin@restaurante.com', 1, 'activo'),
('mesero', 'mesero123', 'mesero01@restaurante.com', 2, 'activo'),
('cocinero', 'cocinero123', 'cocinero@restaurante.com', 3, 'activo'),
('cajero', 'cajero123', 'cajero@restaurante.com', 4, 'activo');

-- 6. Insertar productos de ejemplo
INSERT INTO `productos` (`nombre_producto`, `descripcion`, `precio`, `id_categoria`, `tiempo_preparacion`) VALUES
('Ceviche', 'Ceviche de pescado con limón y cebolla', 25.00, 1, 10),
('Lomo Saltado', 'Lomo saltado con arroz y papas fritas', 35.00, 2, 20),
('Pollo a la Brasa', 'Pollo entero con papas y ensalada', 40.00, 2, 30),
('Tres Leches', 'Postre tres leches con caramelo', 12.00, 3, 5),
('Coca Cola', 'Gaseosa 500ml', 5.00, 4, 2),
('Café Americano', 'Café negro americano', 8.00, 5, 3);

-- 7. Insertar inventario inicial
INSERT INTO `inventario` (`id_producto`, `cantidad`, `stock_minimo`) VALUES
(1, 50, 10),
(2, 30, 5),
(3, 20, 5),
(4, 25, 8),
(5, 100, 20),
(6, 80, 15);

-- 8. Asignar permisos a roles
INSERT INTO `roles_permisos` (`id_rol`, `id_permiso`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),  -- Admin todos los permisos
(2, 4), (2, 6),  -- Mesero: tomar pedidos y gestion caja
(3, 2), (3, 3),  -- Cocina: gestion productos e inventario
(4, 4), (4, 6);  -- Cajero: tomar pedidos y gestion caja