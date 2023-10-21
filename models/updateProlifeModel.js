const Swal = require('sweetalert2');
const updateController = require('../controllers/updateProlifeController');

document.addEventListener('DOMContentLoaded', async () => {
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');

    const storedName = localStorage.getItem('user_name');
    const storedEmail = localStorage.getItem('user_email');

    if (storedName && storedEmail) {
        userNameElement.textContent = storedName;
        userEmailElement.textContent = storedEmail;
    }

    const idInput = document.getElementById('id');
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    const usuarioInput = document.getElementById('usuario');
    const contrasenaInput = document.getElementById('contrasena');
    const correoInput = document.getElementById('correo');
    const actualizarButton = document.getElementById('actualizar');

    const storedData = localStorage.getItem('user_data');

    if (storedData) {
        const userData = JSON.parse(storedData);
        idInput.value = userData.id;
        nombreInput.value = userData.nombre;
        telefonoInput.value = userData.telefono;
        usuarioInput.value = userData.usuario;
        contrasenaInput.value = userData.contrasena;
        correoInput.value = userData.correo;
    }

    actualizarButton.addEventListener('click', async () => {
        const userId = idInput.value;
        const nuevoNombre = nombreInput.value;
        const nuevoTelefono = telefonoInput.value;
        const nuevoUsuario = usuarioInput.value;
        const nuevaContrasena = contrasenaInput.value;
        const nuevoCorreo = correoInput.value;

        if (!userId || !nuevoNombre || !nuevoTelefono || !nuevoUsuario || !nuevaContrasena || !nuevoCorreo) {
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'No dejes campos vacíos.',
            });
            return;
        }

        const confirmacion = await Swal.fire({
            title: '¿Estás seguro de actualizar?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        });

        if (confirmacion.isConfirmed) {
            const actualizacionExitosa = await updateController.actualizarUsuario(userId, nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo);

            if (actualizacionExitosa) {
                Swal.fire({
                    icon: 'success',
                    title: 'Actualización exitosa',
                    text: 'Los datos se han actualizado con éxito.',
                });
                userNameElement.textContent = nuevoNombre;
                userEmailElement.textContent = nuevoCorreo;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la actualización',
                    text: 'No se pudo actualizar los datos del usuario.',
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Acción cancelada',
                text: 'La actualización ha sido cancelada.'
            });
        }

        const userData = {
            id: userId,
            nombre: nuevoNombre,
            telefono: nuevoTelefono,
            usuario: nuevoUsuario,
            contrasena: nuevaContrasena,
            correo: nuevoCorreo
        };
        localStorage.setItem('user_data', JSON.stringify(userData));
    });
});
