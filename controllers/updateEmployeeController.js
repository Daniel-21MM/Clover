const Swal = require('sweetalert2');
const modelo = require('../models/updateEmployeeModel'); // Importa el modelo

async function actualizarUsuario() {
    const user_id = document.getElementById('user_id').value;
    const nombre = document.getElementById('name').value;
    const telefono = document.getElementById('telephone').value;
    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const correo = document.getElementById('email').value;
    const rol = document.getElementById('role').value;
    const direccion = document.getElementById('Direccion').value;

    // Validación para campos vacíos
    if (!user_id || !nombre || !telefono || !usuario || !contrasena || !correo || !direccion) {
        Swal.fire('Campos vacíos', 'Por favor, completa todos los campos obligatorios.', 'warning');
        return false;
    }

    // Mostrar un SweetAlert de confirmación antes de actualizar
    const confirmacion = await Swal.fire({
        title: '¿Deseas actualizar al usuario?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    });

    if (confirmacion.isConfirmed) {
        const archivo = document.getElementById('fileInput').files[0];
        let imgPerfilUrl = '';

        if (archivo) {
            try {
                // Obtener el número actual de imágenes en la carpeta
                const numeroDeImagenes = await modelo.obtenerNumeroDeImagenes();


                // Eliminar la foto anterior si existe
                const rutaFotoAnterior = await modelo.obtenerRutaFotoAnterior(user_id);
                if (rutaFotoAnterior) {
                    await modelo.eliminarFotoAnterior(rutaFotoAnterior);
                }

                imgPerfilUrl = await modelo.guardarImagen(archivo, numeroDeImagenes);

            } catch (error) {
                console.error('Error al guardar la imagen: ' + error);
            }
        }

        const actualizacionExitosa = await modelo.actualizarUsuario(user_id, nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion);

        if (actualizacionExitosa) {
            Swal.fire({
                title: 'Usuario actualizado',
                text: 'El usuario se ha actualizado con éxito.',
                icon: 'success',
            });
        }
    }
}


