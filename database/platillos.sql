-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-12-2023 a las 15:34:26
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

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `platillos`
--
ALTER TABLE `platillos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `platillos`
--
ALTER TABLE `platillos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
