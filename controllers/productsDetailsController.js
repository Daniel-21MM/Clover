const modelo = require('../models/showProductsModels');
const Swal = require('sweetalert2');

async function cargarDatosTablaDetalles() {
    try {
        const tablaDetalles = document.querySelector('#miTablaDetallesProductos tbody');

        // Obtener el ID del artículo desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const idArticulo = urlParams.get('id');

        if (idArticulo) {
            const consultaSQL = `SELECT id, nombrePlatillo, categoria, descripcionPlatillo, precio, fecha_creacion, imagenUrlPlatillo FROM platillos WHERE id = ${idArticulo}`;

            const resultados = await modelo.obtenerDatosPlatillosDesdeBD(consultaSQL);

            if (resultados.length === 1) {
                const articulo = resultados[0];
                // Llena la tabla de detalles con los datos del artículo
                document.getElementById('articuloId').textContent = articulo.id;
                document.getElementById('nombreArticulo').textContent = articulo.nombrePlatillo;
                document.getElementById('categoriaArticulo').textContent = articulo.categoria;
                document.getElementById('precioArticulo').textContent = articulo.precio;

                // Formatea la fecha antes de asignarla al elemento HTML
                const fechaRegistroElement = document.getElementById('fechaRegistroArticulo');
                const fechaRegistro = new Date(articulo.fecha_creacion);

                // Formatea la fecha en el formato "YYYY-MM-DD"
                const formattedDate = fechaRegistro.toISOString().split('T')[0];
                fechaRegistroElement.textContent = formattedDate;

                document.getElementById('descripcionArticulo').textContent = articulo.descripcionPlatillo;

                // Actualiza la imagen del artículo
                const imagenArticulo = document.querySelector('.left-container img');
                imagenArticulo.src = articulo.imagenUrlPlatillo;
            } else {
                // Muestra un SweetAlert para informar que no se encontró un artículo con ese ID
                Swal.fire('Oh, no!', 'No se encontró un artículo con ese ID.', 'error');
            }
        } else {
            // Muestra un SweetAlert para informar que no se proporcionó un ID de artículo en la URL
            Swal.fire('Oh, no!', 'No se proporcionó un ID de artículo en la URL.', 'error');
        }
    } catch (error) {
        console.error('Error al cargar los datos en la tabla de detalles: ', error);
        // Muestra un SweetAlert para informar sobre el error
        Swal.fire('Oh, no!', 'Parece que ha ocurrido un error.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTablaDetalles();
});
