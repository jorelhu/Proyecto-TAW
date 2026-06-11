-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-06-2026 a las 19:28:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aura_nova_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `access_log`
--

CREATE TABLE `access_log` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `ipAddress` varchar(45) NOT NULL,
  `eventType` enum('LOGIN','LOGOUT') NOT NULL,
  `browser` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `order`
--

INSERT INTO `order` (`id`, `userId`, `total`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 123126, 3665.97, 'PENDING', '2026-06-09 08:17:24', '2026-06-09 08:17:24'),
(2, 123126, 3715.97, 'PENDING', '2026-06-09 08:19:15', '2026-06-09 08:19:15'),
(3, 123126, 3715.97, 'PENDING', '2026-06-09 08:25:50', '2026-06-09 08:25:50'),
(4, 123126, 3715.97, 'PENDING', '2026-06-09 08:26:37', '2026-06-09 08:26:37'),
(5, 123126, 3735.97, 'PENDING', '2026-06-09 09:56:58', '2026-06-09 09:56:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orderitem`
--

CREATE TABLE `orderitem` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `variantId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `topNotes` varchar(255) DEFAULT NULL,
  `heartNotes` varchar(255) DEFAULT NULL,
  `baseNotes` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id`, `name`, `brand`, `description`, `topNotes`, `heartNotes`, `baseNotes`, `createdAt`, `updatedAt`) VALUES
(13, 'Perfume Test', 'Test Brand', 'Descripción del producto', 'Nota 1, Nota 2', 'Nota 3, Nota 4', 'Nota 5, Nota 6', '2026-06-09 01:49:38', '2026-06-09 01:49:38'),
(25, '0', '0', '0', '0', '0', '0', '2026-06-09 05:51:26', '2026-06-09 13:25:42'),
(26, 'cambio perfume', 'seaaaaa', 'ad3', '23', '33', 'w3', '2026-06-09 05:54:00', '2026-06-09 07:55:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productimage`
--

CREATE TABLE `productimage` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `isPrimary` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productimage`
--

INSERT INTO `productimage` (`id`, `productId`, `imageUrl`, `isPrimary`) VALUES
(2, 13, 'https://farmacorp.com/cdn/shop/files/7506306249974_704x704.jpg', 1),
(3, 25, 'http://localhost:3000/uploads/products/1780998686754-334790480.jpg', 1),
(4, 26, 'http://localhost:3000/uploads/products/1780998840251-470232711.jpg', 1),
(5, 26, 'http://localhost:3000/uploads/products/1780998840251-198356404.jpg', 0),
(6, 25, 'http://localhost:3000/uploads/products/1780999366353-51211091.jpg', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productvariant`
--

CREATE TABLE `productvariant` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `size` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productvariant`
--

INSERT INTO `productvariant` (`id`, `productId`, `size`, `price`, `stock`) VALUES
(2, 13, '100ml', 50.00, 10),
(10, 25, '50ml', 0.99, 0),
(11, 26, '50ml', 200.00, 33);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` enum('USER','ADMIN') DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`, `role`) VALUES
(123123, 'emanuel', 'ema@gmail.com', '1234', '2026-06-08 20:11:33', '2026-06-08 20:11:33', 'USER'),
(123124, 'Admin', 'admin@test.com', '123456', '2026-06-08 21:16:51', '2026-06-08 21:16:51', 'USER'),
(123125, 'jorel', 'admin@si.com', '123456789', '2026-06-09 07:06:12', '2026-06-09 07:06:12', 'ADMIN'),
(123126, 'hola', 'jonisteinjorel@gmail.com', '$2b$10$BqTRm.N6zGHfGgRwIE4eo.Ejgtwas5ZI7ys4MwDBRQRs6U.hdKqiO', '2026-06-09 07:08:26', '2026-06-09 07:11:28', 'ADMIN');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `access_log`
--
ALTER TABLE `access_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `variantId` (`variantId`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productimage`
--
ALTER TABLE `productimage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`);

--
-- Indices de la tabla `productvariant`
--
ALTER TABLE `productvariant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `access_log`
--
ALTER TABLE `access_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `productimage`
--
ALTER TABLE `productimage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `productvariant`
--
ALTER TABLE `productvariant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123127;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `access_log`
--
ALTER TABLE `access_log`
  ADD CONSTRAINT `access_log_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `orderitem_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderitem_ibfk_2` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productimage`
--
ALTER TABLE `productimage`
  ADD CONSTRAINT `productimage_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productvariant`
--
ALTER TABLE `productvariant`
  ADD CONSTRAINT `productvariant_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
