-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2023 a las 22:57:15
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

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
(1, 1, 'Disponible', 'Mesa al lado del refrigerador ', 5, '2023-11-03', '../assets/imgTables/imgMesa1.jpg'),
(2, 2, 'Disponible', 'Mesa al lado de la puerta', 3, '2023-11-03', '../assets/imgTables/imgMesa2.jpg');

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
(8, 'Alitas de pollo', 'Comidas', 'Ricas alitas de pollo bañadas en salsa.', 135.00, '2023-11-03', '../assets/imgProducts/imgimgPlatillo_1699033589249.jpg'),
(10, 'Cubeta de cervesas', 'Bebidas', 'Cerveza corona bien fria.', 250.00, '2023-11-03', '../assets/imgProducts/imgimgPlatillo_1699033562801.jpg'),
(11, 'Smoti ', 'Bebidas', 'Delicioso smoti dulce y refrescante.', 50.00, '2023-11-03', '../assets/imgProducts/imgimgPlatillo_1699033166758.jpg'),
(12, 'Hot dog', 'Comidas', 'Delicioso hot dog con doble salchicha.', 78.00, '2023-11-03', '../assets/imgProducts/imgPlatillo4.jpg');

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
(2, 'Kristen Ayslin Trejo Hernandez ', 7821345623, 'Kristen', 'abc', 'kristen@gmail.com', 0, '../assets/imgUsers/imgPerfil_1699028171228.jpg', 'Av. Poza Rica', '2023-11-01'),
(3, 'Brian Ethel Hernandez Huerta', 7841323456, 'Brian', 'budshy12', 'ethel@gmail.com', 0, '../assets/imgUsers/imgPerfil2.jpg', 'Av. Lomas Turbas', '2023-11-02'),
(5, 'Maribel Maldonado San Martin', 7841238943, 'Mary', 'hdy6dw', 'mary@gmail.com', 0, '../assets/imgUsers/imgPerfil_1699028073221.jpg', 'Av. Cerro Grande', '2023-11-03'),
(6, 'Saira Garcias Santes', 7841239821, 'Saira', 'test12', 'saira@gmail.com', 0, '../assets/imgUsers/imgPerfil_1699028345067.jpg', 'Av. Tlahuanapa, Ver', '2023-11-03');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `mesas`
--
ALTER TABLE `mesas`
  ADD PRIMARY KEY (`idMesas`);

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `mesas`
--
ALTER TABLE `mesas`
  MODIFY `idMesas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `platillos`
--
ALTER TABLE `platillos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
