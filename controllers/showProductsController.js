const Swal = require('sweetalert2');
const modelo = require('../models/showProductsModels');

let paginaActual = 1;
const registrosPorPagina = 3;


async function cargarDatosTabla(tablaId) {
    try {
        const tabla = document.querySelector(`#${tablaId} tbody`);
        tabla.innerHTML = '';

        const inicio = (paginaActual - 1) * registrosPorPagina;

        const consultaSQL = `SELECT id, nombrePlatillo, categoria, descripcionPlatillo, precio, fecha_creacion, imagenUrlPlatillo 
                     FROM platillos LIMIT ${inicio}, ${registrosPorPagina}`;

        const resultados = await modelo.obtenerDatosPlatillosDesdeBD(consultaSQL);

        if (resultados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="7">No hay datos para mostrar</td>'; 
            tr.classList.add('tablaDatos')
            tabla.appendChild(tr);
           

            document.getElementById('prevBtn').disabled = true;
            document.getElementById('nextBtn').disabled = true;
        } else {
            // Mostrar los datos en la tabla
            resultados.forEach((platillo) => {
                const fecha = new Date(platillo.fecha_creacion).toISOString().split('T')[0];
    
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${platillo.id}</td>
                    <td><img src="${platillo.imagenUrlPlatillo}" alt="Imagen del platillo"></td>
                    <td>${platillo.nombrePlatillo}</td>
                    <td>${platillo.categoria}</td>
                    <td>$ ${platillo.precio}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="details" data-id="${platillo.id}"><i class='bx bx-show'></i></button> 
                        <button class="edit" data-id="${platillo.id}"><i class='bx bx-edit'></i></button>
                        <button class="delete" data-id="${platillo.id}"><i class='bx bx-trash'></i></button>
                    </td>
                `;
    
            
                const editButton = tr.querySelector('.edit');
    
           
                editButton.addEventListener('click', () => {
          
                    const platilloId = editButton.getAttribute('data-id');
    
                    window.location.href = `editProduct.html?id=${platilloId}`;
                });
    
                tabla.appendChild(tr);
    
                const deleteButton = tr.querySelector('.delete');
                deleteButton.addEventListener('click', eliminarPlatillo);
    
                const detailsButton = tr.querySelector('.details');
                detailsButton.addEventListener('click', () => {
                    const idPlatillo = detailsButton.getAttribute('data-id');
                    window.location.href = `productsDetails.html?id=${idPlatillo}`;
                });
            });

            // Habilitar o deshabilitar los botones de paginación según corresponda
            document.getElementById('prevBtn').disabled = (paginaActual === 1);
            document.getElementById('nextBtn').disabled = (resultados.length < registrosPorPagina);
        }

    } catch (error) {
        console.error('Error al cargar los datos en la tabla: ', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar los datos',
            text: 'No se pudieron cargar los datos de la base de datos.',
        });
    }
}

function cargarPaginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        cargarDatosTabla('TablaArticulos');
    }
}

function cargarPaginaSiguiente() {
    paginaActual++;
    cargarDatosTabla('TablaArticulos');
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTabla('TablaArticulos');

    document.getElementById('prevBtn').addEventListener('click', cargarPaginaAnterior);
    document.getElementById('nextBtn').addEventListener('click', cargarPaginaSiguiente);
});

async function eliminarPlatillo(event) {
    const row = event.currentTarget.parentElement.parentElement;
    if (row) {
        const idPlatillo = event.currentTarget.getAttribute('data-id');

        // Agregar un console.log para depuración
        console.log('ID del platillo a eliminar: ', idPlatillo);

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el registro del articulo permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Obtener la ruta de la imagen del platillo antes de eliminar el registro
                    const platillo = await modelo.obtenerPlatilloPorID(idPlatillo);
                    if (platillo) {
                        const imagenUrlPlatillo = platillo.imagenUrlPlatillo;

                        // Eliminar la imagen de la carpeta
                        await modelo.eliminarImagen(imagenUrlPlatillo);

                        // Eliminar el registro del platillo en la base de datos
                        await modelo.eliminarPlatillo(idPlatillo);

                        row.remove();
                        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
                    }
                } catch (error) {
                    console.error('Error al eliminar el platillo: ', error);
                    Swal.fire('Error', 'No se pudo eliminar el registro del platillo.', 'error');
                }
            }
        });
    } else {
        console.error('Error: No se pudo encontrar el elemento padre.');
    }
}


