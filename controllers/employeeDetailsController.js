const modelo = require('../models/showUsersModel');
const Swal = require('sweetalert2');

async function cargarDatosTablaDetalles() {
    try {
        const tablaDetalles = document.querySelector('#miTablaDetalles tbody');

        // Obtener el ID del usuario desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const idUsuario = urlParams.get('id');

        if (idUsuario) {
            const consultaSQL = `SELECT id, nombre, telefono, usuario, correo, rol, direccion, fecha, imgPerfilUrl FROM usuarios WHERE id = ${idUsuario}`;

            const resultados = await modelo.obtenerDatosUsuariosDesdeBD(consultaSQL);

            if (resultados.length === 1) {
                const usuario = resultados[0];
                // Llena la tabla de detalles con los datos del usuario
                document.getElementById('userId').textContent = usuario.id;
                document.getElementById('nombreCompletoUsuario').textContent = usuario.nombre;
                document.getElementById('telefonoUsuario').textContent = usuario.telefono;
                document.getElementById('nombreUsuario').textContent = usuario.usuario;
                document.getElementById('correoUsuario').textContent = usuario.correo;
                document.getElementById('rolUsuario').textContent = usuario.rol === 1 ? 'Administrador' : 'Empleado';
                document.getElementById('direccionUsuario').textContent = usuario.direccion;

                // Formatea la fecha antes de asignarla al elemento HTML
                const fechaRegistroElement = document.getElementById('fechaRegistro');
                const fechaRegistro = new Date(usuario.fecha).toISOString().split('T')[0];
                fechaRegistroElement.textContent = fechaRegistro;

                // Actualiza la imagen del usuario
                const imagenUsuario = document.querySelector('.left-container img');
                imagenUsuario.src = usuario.imgPerfilUrl;

                // Actualiza el nombre completo y el rol
                const nombreCompletoElement = document.querySelector('.left-container h2');
                const rolElement = document.querySelector('.left-container p');
                nombreCompletoElement.textContent = usuario.nombre;
                rolElement.textContent = usuario.rol === 1 ? 'Administrador' : 'Empleado';
            } else {
                // Muestra un SweetAlert para informar que no se encontró un usuario con ese ID
                Swal.fire('Oh, no!', 'No se encontró un usuario con ese ID.', 'error');
            }
        } else {
            // Muestra un SweetAlert para informar que no se proporcionó un ID de usuario en la URL
            Swal.fire('Oh, no!', 'No se proporcionó un ID de usuario en la URL.', 'error');
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
