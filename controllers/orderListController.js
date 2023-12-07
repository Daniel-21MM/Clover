const Swal = require('sweetalert2');
const modelo = require('../models/orderListModel');

async function cargarDatosTabla(tablaId) {
    try {
        console.log(`Intentando seleccionar la tabla con ID: ${tablaId}`);
        const tabla = document.querySelector(`#${tablaId} tbody`);
        tabla.innerHTML = '';

        const consultaSQL = 'SELECT idPedido, numeroMesa, nombreCliente, estado, Descuento, fechaHora FROM pedidos';

        const resultados = await modelo.obtenerDatosPedidosDesdeBD(consultaSQL);

        resultados.forEach((pedido) => {
            // Dentro del bucle forEach en cargarDatosTabla
            resultados.forEach((pedido) => {
                const fecha = new Date(pedido.fechaHora).toISOString().split('T')[0];

                const tr = document.createElement('tr');

                tr.innerHTML = `
        <td>${pedido.idPedido}</td>
        <td>${pedido.numeroMesa}</td>
        <td>${pedido.nombreCliente}</td>
        <td style="color: ${pedido.estado === 'En proceso' ? '#0C5FCD' : '#DB504A'}">${pedido.estado}</td>
        <td>${fecha}</td>
        <td>
            <!-- Agrega aquí los botones de acciones según tus necesidades -->
        </td>
    `;

                // Puedes agregar aquí los botones de acciones (editar, detalles, eliminar) de manera similar al ejemplo anterior

                tabla.appendChild(tr);
            });
        });
    } catch (error) {
        console.error('Error al cargar los datos en la tabla: ', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar los datos',
            text: 'No se pudieron cargar los datos de la base de datos.'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTabla('TablaMesas');
});
