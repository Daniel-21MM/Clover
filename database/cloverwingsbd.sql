-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-12-2023 a las 15:31:12
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cloverwingsbd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datosempresa`
--

CREATE TABLE `datosempresa` (
  `id` int(11) NOT NULL,
  `nombreEmpresa` varchar(255) NOT NULL,
  `direccionEmpresa` varchar(255) NOT NULL,
  `telefonoEmpresa` bigint(20) DEFAULT NULL,
  `emailEmpresa` varchar(255) DEFAULT NULL,
  `detallesEmpresa` varchar(255) DEFAULT NULL,
  `imgUrl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `datosempresa`
--

INSERT INTO `datosempresa` (`id`, `nombreEmpresa`, `direccionEmpresa`, `telefonoEmpresa`, `emailEmpresa`, `detallesEmpresa`, `imgUrl`) VALUES
(1, 'Clover Wings', 'Calle Durango, esquina Sonora. Colonia Mexico , Poza Rica, Mexico.', 7821709756, 'cloverwings@gmail.com', 'Restaurante de alitas y hamburguesas.', '../assets/imgLogo/imgEmpresa_1699929415961.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesas`
--

CREATE TABLE `mesas` (
  `idMesas` int(11) NOT NULL,
  `numeroMesa` int(11) NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `imgMesaUrl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mesas`
--

INSERT INTO `mesas` (`idMesas`, `numeroMesa`, `estado`, `descripcion`, `capacidad`, `fecha_creacion`, `imgMesaUrl`) VALUES
(13, 1, 'Disponible', 'Mesa junto al refrigerador.', 5, '2023-12-15', '../assets/imgTables/imgMesa3.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `idPedido` int(11) NOT NULL,
  `numeroMesa` int(11) NOT NULL,
  `nombreCliente` varchar(255) NOT NULL,
  `DetallesPedidos` varchar(500) DEFAULT NULL,
  `Descuento` decimal(10,2) DEFAULT 0.00,
  `fechaHora` timestamp NULL DEFAULT current_timestamp(),
  `estado` varchar(20) NOT NULL DEFAULT 'En proceso'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`idPedido`, `numeroMesa`, `nombreCliente`, `DetallesPedidos`, `Descuento`, `fechaHora`, `estado`) VALUES
(93, 1, 'Juan Jesus ', '[{\"Platillo\":\"Alitas de pollo\",\"Cantidad\":\"4\",\"Total\":\"$48.00\"},{\"Platillo\":\"Cerveza\",\"Cantidad\":\"2\",\"Total\":\"$72.00\"}]', 10.00, '2023-12-15 14:26:00', 'Finalizado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platillos`
--

CREATE TABLE `platillos` (
  `id` int(11) NOT NULL,
  `nombrePlatillo` varchar(255) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `descripcionPlatillo` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `imagenUrlPlatillo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `platillos`
--

INSERT INTO `platillos` (`id`, `nombrePlatillo`, `categoria`, `descripcionPlatillo`, `precio`, `fecha_creacion`, `imagenUrlPlatillo`) VALUES
(18, 'Alitas de pollo', 'Comidas', 'Ricas alitas de pollo bañadas en salsa.', 12.00, '2023-12-15', '../assets/imgProducts/imgimgPlatillo_1702650312783.jpg'),
(19, 'Cerveza', 'Bebidas', 'Cerveza corona bien fria.', 40.00, '2023-12-15', '../assets/imgProducts/imgPlatillo2.jpg'),
(20, 'Paste del chocolate', 'Postres', 'Delicioso paste de chocolate.', 90.00, '2023-12-15', '../assets/imgProducts/imgimgPlatillo_1702650323713.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` bigint(20) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `rol` tinyint(4) NOT NULL,
  `imgPerfilUrl` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `telefono`, `usuario`, `contrasena`, `correo`, `rol`, `imgPerfilUrl`, `direccion`, `fecha`) VALUES
(1, 'Clover Wings', 7841425806, 'Clover', '123', 'Depreed@Outlook.com', 1, '../assets/imgUsers/imgPerfil.jpg', 'Av. Adolfo Lopez Mateos S/N', '2023-10-26'),
(3, 'Brian Ethel Hernandez Huerta', 7841323456, 'Brian', '123', 'ethel@gmail.com', 0, '../assets/imgUsers/imgPerfil_1699800451155.jpg', 'Av. Loma Bonita', '2023-11-02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `idVenta` int(11) NOT NULL,
  `DetallesPedidos` text DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fechaHora` datetime DEFAULT NULL,
  `idPedido` int(11) DEFAULT NULL,
  `nombreCliente` varchar(255) DEFAULT NULL,
  `numeroMesa` int(11) DEFAULT NULL,
  `totalGanancia` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`idVenta`, `DetallesPedidos`, `estado`, `fechaHora`, `idPedido`, `nombreCliente`, `numeroMesa`, `totalGanancia`) VALUES
(12, '[{\"Platillo\":\"Alitas de pollo\",\"Cantidad\":\"4\",\"Total\":\"$48.00\"},{\"Platillo\":\"Cerveza\",\"Cantidad\":\"2\",\"Total\":\"$72.00\"}]', 'Finalizado', '2023-12-15 08:28:06', 93, 'Juan Jesus ', 1, 120.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `datosempresa`
--
ALTER TABLE `datosempresa`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mesas`
--
ALTER TABLE `mesas`
  ADD PRIMARY KEY (`idMesas`),
  ADD KEY `numeroMesa` (`numeroMesa`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`idPedido`),
  ADD KEY `numeroMesa` (`numeroMesa`);

--
-- Indices de la tabla `platillos`
--
ALTER TABLE `platillos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`idVenta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `datosempresa`
--
ALTER TABLE `datosempresa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mesas`
--
ALTER TABLE `mesas`
  MODIFY `idMesas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `idPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT de la tabla `platillos`
--
ALTER TABLE `platillos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `idVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`numeroMesa`) REFERENCES `mesas` (`numeroMesa`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
