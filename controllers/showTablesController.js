const Swal = require('sweetalert2');
const modelo = require('../models/showTablesModel');

async function cargarDatosTabla(tablaId) {
    try {
        const tabla = document.querySelector(`#${tablaId} tbody`);
        tabla.innerHTML = '';

        const consultaSQL = 'SELECT idMesas, numeroMesa, estado, capacidad, fecha_creacion, imgMesaUrl FROM mesas';

        const resultados = await modelo.obtenerDatosMesasDesdeBD(consultaSQL);

        resultados.forEach((mesa) => {
            const fecha = new Date(mesa.fecha_creacion).toISOString().split('T')[0];

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${mesa.idMesas}</td>
                <td><img src="${mesa.imgMesaUrl}" alt="Imagen de la mesa"></td>
                <td>${mesa.numeroMesa}</td>
                <td>${mesa.estado}</td>
                <td>${mesa.capacidad}</td>
                <td>${fecha}</td>
                <td>
                    <button class="details" data-id="${mesa.idMesas}"><i class='bx bx-show'></i></button> 
                    <button class = "edit" data-id="${mesa.idMesas}"><i class='bx bx-edit'></i></button>
                    <button class="delete" data-id="${mesa.idMesas}"><i class='bx bx-trash'></i></button>
                </td>
            `;

            // Obtener una referencia al botón de edición por su clase CSS
            const editButton = tr.querySelector('.edit');

            // Agregar un evento click al botón de edición
            editButton.addEventListener('click', () => {
                // Obtener el valor del atributo data-id para identificar la mesa
                const mesaId = editButton.getAttribute('data-id');

                // Redirigir a la página de edición con el ID de la mesa
                window.location.href = `editTable.html?id=${mesaId}`;
            });

            // Obtener una referencia al botón de detalles por su clase CSS
            const detailsButton = tr.querySelector('.details');

            // Agregar un evento click al botón de detalles
            detailsButton.addEventListener('click', () => {
                const idMesa = detailsButton.getAttribute('data-id');
                window.location.href = `tablesDetails.html?id=${idMesa}`;
            });

            const deleteButton = tr.querySelector('.delete');
            deleteButton.addEventListener('click', eliminarMesa);

            tabla.appendChild(tr);
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

async function eliminarMesa(event) {
    const row = event.currentTarget.parentElement.parentElement;
    if (row) {
        const idMesa = event.currentTarget.getAttribute('data-id');

        // Agregar un console.log para depuración
        console.log('ID de la mesa a eliminar: ', idMesa);

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el registro de la mesa permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Obtener la ruta de la imagen de la mesa antes de eliminar el registro
                    const mesa = await modelo.obtenerMesaPorID(idMesa);
                    if (mesa) {
                        const imgMesaUrl = mesa.imgMesaUrl;

                        // Eliminar la imagen de la carpeta
                        await modelo.eliminarImagen(imgMesaUrl);

                        // Eliminar el registro de la mesa en la base de datos
                        await modelo.eliminarMesa(idMesa);

                        row.remove();
                        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
                    }
                } catch (error) {
                    console.error('Error al eliminar la mesa: ', error);
                    Swal.fire('Error', 'No se pudo eliminar el registro de la mesa.', 'error');
                }
            }
        });
    } else {
        console.error('Error: No se pudo encontrar el elemento padre.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTabla('TablaMesas');
});
