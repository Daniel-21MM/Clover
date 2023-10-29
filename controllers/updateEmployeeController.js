const Swal = require('sweetalert2');
const modeloShowUsers = require('../models/showUsersModel');
const modeloUpdateEmployeeController = require('../models/updateEmployeeModel'); // Importa el modelo que contiene las funciones

function obtenerUserIdDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function mostrarImagen(imgPerfilUrl) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = imgPerfilUrl;
    imagePreview.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const user_id = obtenerUserIdDeURL();

    if (user_id) {
        try {
            const usuario = await modeloShowUsers.obtenerUsuarioPorID(user_id);

            if (usuario) {
                document.getElementById('user_id').value = user_id;
                document.getElementById('name').value = usuario.nombre;
                document.getElementById('telephone').value = usuario.telefono;
                document.getElementById('username').value = usuario.usuario;
                document.getElementById('password').value = usuario.contrasena;
                document.getElementById('email').value = usuario.correo;
                document.getElementById('role').value = usuario.rol;
                document.getElementById('Direccion').value = usuario.direccion;

                if (usuario.imgPerfilUrl) {
                    mostrarImagen(usuario.imgPerfilUrl);
                }
            } else {
                console.error('No se encontró un usuario con ese ID.');
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario: ', error);
        }
    } else {
        console.error('No se proporcionó un ID de usuario en la URL.');
    }
});

async function actualizarUsuario() {
    const user_id = document.getElementById('user_id').value;
    const nombre = document.getElementById('name').value;
    const telefono = document.getElementById('telephone').value;
    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const correo = document.getElementById('email').value;
    const rol = document.getElementById('role').value;
    const direccion = document.getElementById('Direccion').value;

    if (!user_id || !nombre || !telefono || !usuario || !contrasena || !correo || !direccion) {
        Swal.fire('Campos vacíos', 'Por favor, completa todos los campos obligatorios.', 'warning');
        return false;
    }

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
                const numeroDeImagenes = await modeloUpdateEmployeeController.obtenerNumeroDeImagenes();
                const rutaFotoAnterior = await modeloUpdateEmployeeController.obtenerRutaFotoAnterior(user_id);
                
                if (rutaFotoAnterior) {
                    await modeloUpdateEmployeeController.eliminarFotoAnterior(rutaFotoAnterior);
                }

                imgPerfilUrl = await modeloUpdateEmployeeController.guardarImagen(archivo); // Usa la función del modelo de actualización
            } catch (error) {
                console.error('Error al guardar la imagen: ' + error);
            }
        }

        const actualizacionExitosa = await modeloUpdateEmployeeController.actualizarUsuario(user_id, nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion);

        if (actualizacionExitosa) {
            Swal.fire({
                title: 'Usuario actualizado',
                text: 'El usuario se ha actualizado con éxito.',
                icon: 'success',
            });
        }
    }
}

function clearForm() {
    document.getElementById('user_id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('telephone').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('email').value = '';
    document.getElementById('role').value = '';
    document.getElementById('Direccion').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function chooseFile() {
    document.getElementById('fileInput').click();
}

function previewImage() {
    const archivo = document.getElementById('fileInput').files[0];
    const imagePreview = document.getElementById('imagePreview');
    const fileIcon = document.getElementById('fileIcon');

    if (archivo) {
        const reader = new FileReader();
        reader.onload = function() {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(archivo);
    }
}

function changeImage() {
    document.getElementById('fileInput').click();
}



