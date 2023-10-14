const Swal = require('sweetalert2');
const updateController = require('../controllers/updateProlifeController');

document.addEventListener('DOMContentLoaded', () => {
    const idInput = document.getElementById('id'); // Obtener el campo de ID
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    const usuarioInput = document.getElementById('usuario');
    const contrasenaInput = document.getElementById('contrasena');
    const correoInput = document.getElementById('correo');
    const actualizarButton = document.getElementById('actualizar');

    actualizarButton.addEventListener('click', async () => {
        const userId = idInput.value; // Obtener el ID del usuario a actualizar
        const nuevoNombre = nombreInput.value;
        const nuevoTelefono = telefonoInput.value;
        const nuevoUsuario = usuarioInput.value;
        const nuevaContrasena = contrasenaInput.value;
        const nuevoCorreo = correoInput.value;

        // Validar que los campos no estén vacíos, incluido el ID
        if (!userId || !nuevoNombre || !nuevoTelefono || !nuevoUsuario || !nuevaContrasena || !nuevoCorreo) {
            console.log("Campos vacíos");
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'No dejes campos vacíos.',
            });
            return;
        }

        // Mostrar alerta de confirmación
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro de actualizar?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        });

        if (confirmacion.isConfirmed) {
            try {
                const actualizacionExitosa = await updateController.actualizarUsuario(userId, nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo);

                if (actualizacionExitosa) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualización exitosa',
                        text: 'Los datos se han actualizado con éxito.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en la actualización',
                        text: 'No se pudo actualizar los datos del usuario.',
                    });
                }
            } catch (error) {
                console.error('Error al actualizar el perfil:', error.message);
            }
        } else {
            // El usuario hizo clic en "No"
            Swal.fire({
                icon: 'info',
                title: 'Acción cancelada',
                text: 'La actualización ha sido cancelada.'
            });
        }
    });
});
