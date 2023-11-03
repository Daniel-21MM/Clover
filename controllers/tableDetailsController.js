const modelo = require('../models/showTablesModel');
const Swal = require('sweetalert2');

async function cargarDatosTablaDetalles() {
    try {
        const tablaDetalles = document.querySelector('#miTablaDetallesMesa tbody');

        // Obtener el ID de la mesa desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const idMesa = urlParams.get('id');

        if (idMesa) {
            const consultaSQL = `SELECT idMesas, numeroMesa, estado, descripcion, capacidad, fecha_creacion, imgMesaUrl FROM mesas WHERE idMesas = ${idMesa}`;

            const resultados = await modelo.obtenerDatosMesasDesdeBD(consultaSQL);

            if (resultados.length === 1) {
                const mesa = resultados[0];
                // Llena la tabla de detalles con los datos de la mesa
                document.getElementById('mesaId').textContent = mesa.idMesas;
                document.getElementById('numeroMesa').textContent = mesa.numeroMesa;
                document.getElementById('estadoMesa').textContent = mesa.estado;
                document.getElementById('capacidadMesa').textContent = mesa.capacidad;

                // Formatea la fecha antes de asignarla al elemento HTML
                const fechaRegistroElement = document.getElementById('fechaRegistroMesa');
                const fechaRegistro = new Date(mesa.fecha_creacion);

                // Formatea la fecha en el formato "YYYY-MM-DD"
                const formattedDate = fechaRegistro.toISOString().split('T')[0];
                fechaRegistroElement.textContent = formattedDate;

                document.getElementById('descripcionMesa').textContent = mesa.descripcion;

                // Actualiza la imagen de la mesa
                const imagenMesa = document.getElementById('imagenMesa');
                imagenMesa.src = mesa.imgMesaUrl;
            } else {
                // Muestra un SweetAlert para informar que no se encontró una mesa con ese ID
                Swal.fire('Oh, no!', 'No se encontró una mesa con ese ID.', 'error');
            }
        } else {
            // Muestra un SweetAlert para informar que no se proporcionó un ID de mesa en la URL
            Swal.fire('Oh, no!', 'No se proporcionó un ID de mesa en la URL.', 'error');
        }
    } catch (error) {
        console.error('Error al cargar los datos en la tabla de detalles de mesa: ', error);
        // Muestra un SweetAlert para informar sobre el error
        Swal.fire('Oh, no!', 'Parece que ha ocurrido un error.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTablaDetalles();
});
