const Swal = require('sweetalert2');
const modelo = require('../models/salesListModel');

async function cargarDatosTabla(tablaId) {
    try {
        const tabla = document.querySelector(`#${tablaId} tbody`);
        tabla.innerHTML = '';

        const consultaSQL = 'SELECT idVenta, nombreCliente, numeroMesa, fechaHora, estado, totalGanancia FROM ventas';

        const resultados = await modelo.obtenerDatosVentsasDesdeBD(consultaSQL);

        resultados.forEach((venta) => {
            const fecha = new Date(venta.fechaHora).toISOString().split('T')[0];

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${venta.idVenta}</td>
                <td>${venta.nombreCliente}</td>
                <td>${venta.numeroMesa}</td>
                <td>${fecha}</td>
                <td>${venta.estado}</td>
                <td>$${venta.totalGanancia}</td>
            `;

            tabla.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar los datos en la tabla: ', error);
        // Resto del código para mostrar el mensaje de error
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTabla('TablaMesas');
});
