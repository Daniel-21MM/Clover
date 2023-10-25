const db = require('../database/db');
const Swal = require('sweetalert2');
const modelo = require('../controllers/showUserController');

function formatearTelefono(telefono) {
    const telefonoStr = telefono.toString();
    return telefonoStr.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4');
}

async function cargarDatosTabla() {
    try {
        const tabla = document.querySelector('#miTabla tbody');
        tabla.innerHTML = '';

        const consultaSQL = 'SELECT id, usuario, rol, correo, telefono, fecha, imgPerfilUrl FROM usuarios';

        const resultados = await modelo.obtenerDatosUsuariosDesdeBD(consultaSQL);

        resultados.forEach((usuario) => {
            const fecha = new Date(usuario.fecha).toISOString().split('T')[0];
            const rolTexto = usuario.rol === 1 ? 'Administrador' : 'Empleado';
            const telefonoFormateado = formatearTelefono(usuario.telefono);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td><img src="${usuario.imgPerfilUrl}" alt="Perfil de usuario"></td>
                <td>${usuario.usuario}</td>
                <td>${rolTexto}</td>
                <td>${usuario.correo}</td>
                <td>${telefonoFormateado}</td>
                <td>${fecha}</td>
                <td>
                    <button class="edit" data-id="${usuario.id}"><i class='bx bx-edit'></i></button>
                    <button class="delete" data-id="${usuario.id}"><i class='bx bx-trash'></i></button>
                </td>
            `;

            tabla.appendChild(tr);

            const deleteButton = tr.querySelector('.delete');
            deleteButton.addEventListener('click', eliminarUsuario);
        });

        // Agrega un manejador de eventos al botón "Editar" para redirigir a la vista de edición
        const editButtons = document.querySelectorAll('.edit');

        editButtons.forEach((editButton) => {
            editButton.addEventListener('click', () => {
                // Obtiene el ID del usuario que se está editando
                const idUsuario = editButton.getAttribute('data-id');

                // Redirige a la vista de edición (editUser.html) con el ID del usuario como parámetro
                window.location.href = `editUsers.html?id=${idUsuario}`;
            });
        });
    } catch (error) {
        console.error('Error al cargar los datos en la tabla: ', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar los datos',
            text: 'No se pudieron cargar los datos de la base de datos.',
        });
    }
}

function eliminarUsuario(event) {
    const row = event.currentTarget.parentElement.parentElement;
    if (row) {
        const idUsuario = event.currentTarget.getAttribute('data-id');

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el registro de usuario.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await modelo.eliminarUsuario(idUsuario);
                    row.remove();
                    Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
                } catch (error) {
                    console.error('Error al eliminar el usuario: ', error);
                    Swal.fire('Error', 'No se pudo eliminar el registro de usuario.', 'error');
                }
            }
        });
    } else {
        console.error('Error: No se pudo encontrar el elemento padre.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTabla();
});


