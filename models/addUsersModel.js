// ============
const fs = require('fs');
const path = require('path');
const usuarioController = require('../controllers/addUserController');
const Swal = require('sweetalert2');

async function registrarUsuario() {
    const archivo = document.getElementById('fileInput').files[0];
    const nombre = document.getElementById('name').value;
    const telefono = document.getElementById('telephone').value;
    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const correo = document.getElementById('email').value;
    const rol = document.getElementById('role').value;
    const direccion = document.getElementById('Direccion').value;
    const fecha = document.getElementById('registration_date').value;

    // Mostrar un SweetAlert de confirmación antes de registrar
    const confirmacion = await Swal.fire({
        title: '¿Deseas registrar al usuario?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    });

    if (!confirmacion.isConfirmed) {
        return; // Si no se confirma, simplemente salimos de la función
    }

    let imgPerfilUrl = '';
    if (archivo) {
        try {
            // Obtener el número actual de imágenes en la carpeta
            const numeroDeImagenes = obtenerNumeroDeImagenes();
            imgPerfilUrl = await guardarImagen(archivo, numeroDeImagenes);
        } catch (error) {
            console.error('Error al guardar la imagen: ' + error);
        }
    }

    usuarioController.insertarUsuario(nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha)
        .then((registroExitoso) => {
            if (registroExitoso) {
                // Puedes realizar acciones adicionales aquí, como mostrar un Sweet Alert.
                Swal.fire({
                    title: 'Usuario creado',
                    text: 'El usuario se ha registrado con éxito.',
                    icon: 'success',
                });
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

function obtenerNumeroDeImagenes() {
    const rutaCarpeta = path.join(__dirname, '../assets/imgUsers/');
    // Leemos la lista de archivos en la carpeta
    const archivos = fs.readdirSync(rutaCarpeta);

    // Filtrar solo archivos de imagen, si es necesario
    const imagenes = archivos.filter((archivo) =>
        archivo.toLowerCase().endsWith('.jpg') ||
        archivo.toLowerCase().endsWith('.jpeg') ||
        archivo.toLowerCase().endsWith('.png')
    );

    // Retornar el número de imágenes
    return imagenes.length;
}

function guardarImagen(archivo, numeroDeImagenes) {
    return new Promise((resolve, reject) => {
        const rutaCarpeta = path.join(__dirname, '../assets/imgUsers/');
        const nombreArchivo = `imgPerfil${numeroDeImagenes + 1}.jpg`; // Nombre con contador
        const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

        fs.copyFile(archivo.path, rutaCompleta, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('../assets/imgUsers/' + nombreArchivo);
            }
        });
    });
}
// Resto del código...

module.exports = {
    registrarUsuario,
    clearForm
};