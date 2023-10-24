const fs = require('fs');
const path = require('path');
const usuarioController = require('../controllers/addUserController');

async function registrarUsuario() {
    const archivo = document.getElementById('fileInput').files[0];

    let imgPerfilUrl = '';
    if (archivo) {
        try {
            imgPerfilUrl = await guardarImagen(archivo);
        } catch (error) {
            console.error('Error al guardar la imagen: ' + error);
        }
    }

    const nombre = document.getElementById('name').value;
    const telefono = document.getElementById('telephone').value;
    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const correo = document.getElementById('email').value;
    const rol = document.getElementById('role').value;
    const direccion = document.getElementById('Direccion').value;
    const fecha = document.getElementById('registration_date').value;

    usuarioController.insertarUsuario(nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha)
        .then((registroExitoso) => {
            if (registroExitoso) {
                // Puedes realizar acciones adicionales aquí, como limpiar el formulario o redirigir al usuario.
            }
        });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('telephone').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('email').value = '';
    document.getElementById('role').value = '1'; // Establecer el valor predeterminado para el rol
    document.getElementById('Direccion').value = '';
    document.getElementById('registration_date').value = '';

    // También puedes restablecer la vista previa de la imagen si es necesario
    document.getElementById('imagePreview').style.display = 'none';
    // O cualquier otra lógica que necesites para la vista previa de la imagen

    // Puedes agregar más campos aquí según sea necesario
}
function guardarImagen(archivo) {
    return new Promise((resolve, reject) => {
        const rutaCarpeta = path.join(__dirname, '../assets/imgUsers/'); // Ruta a la carpeta de imágenes
        const nombreArchivo = Date.now() + '_' + archivo.name; // Nombre único para evitar conflictos
        const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

        fs.copyFile(archivo.path, rutaCompleta, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('/assets/imgUsers/' + nombreArchivo); // Ruta relativa para guardar en la base de datos
            }
        });
    });
}

module.exports = {
    registrarUsuario,
    clearForm
};
