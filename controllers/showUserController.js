const db = require('../database/db');
const Swal = require('sweetalert2');

function formatearTelefono(telefono) {
    // Convierte el número de teléfono a una cadena.
    const telefonoStr = telefono.toString();

    // Divide el número en grupos de tres dígitos y luego los une con guiones.
    return telefonoStr.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4');
}


// Función para cargar los datos de la tabla desde la base de datos.
async function cargarDatosTabla() {
    try {
        const tabla = document.querySelector('#miTabla tbody');
        tabla.innerHTML = ''; // Limpia el contenido anterior de la tabla.

        const consultaSQL = 'SELECT id, usuario, rol, correo, telefono, fecha, imgPerfilUrl FROM usuarios';

        const resultados = await obtenerDatosUsuariosDesdeBD(consultaSQL);

        resultados.forEach((usuario) => {
            // Formatea la fecha al estilo "yyyy-mm-dd"
            const fecha = new Date(usuario.fecha).toISOString().split('T')[0];

            const rolTexto = usuario.rol === 1 ? 'Administrador' : 'Empleado';

            // Formatea el número de teléfono
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
                    <button><i class='bx bx-edit'></i></button>
                    <button class="delete"><i class='bx bx-trash'></i></button>
                </td>
            `;

            tabla.appendChild(tr);
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

// Llama a la función para cargar los datos de la tabla cuando se carga la página.
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTabla();
});

// ... (otras partes de tu código)
