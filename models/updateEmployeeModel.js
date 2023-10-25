const fs = require('fs');
const path = require('path');
const usuarioController = require('../controllers/updateEmployeeController');
const db = require('../database/db');
const Swal = require('sweetalert2');

async function guardarImagen(archivo, numeroDeImagenes) {
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

async function actualizarUsuario() {
    const archivo = document.getElementById('fileInput').files[0];

    let imgPerfilUrl = '';
    if (archivo) {
        try {
            // Obtener el número actual de imágenes en la carpeta
            const numeroDeImagenes = obtenerNumeroDeImagenes();

            // Eliminar la foto anterior si existe
            const user_id = document.getElementById('user_id').value;
            const rutaFotoAnterior = await obtenerRutaFotoAnterior(user_id);
            console.log('Ruta de la foto anterior:', rutaFotoAnterior);
            if (rutaFotoAnterior) {
                eliminarFotoAnterior(rutaFotoAnterior);
            }

            imgPerfilUrl = await guardarImagen(archivo, numeroDeImagenes);
        } catch (error) {
            console.error('Error al guardar la imagen: ' + error);
        }
    }

    const user_id = document.getElementById('user_id').value; // Obtener el ID del usuario a actualizar
    const nombre = document.getElementById('name').value;
    const telefono = document.getElementById('telephone').value;
    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const correo = document.getElementById('email').value;
    const rol = document.getElementById('role').value;
    const direccion = document.getElementById('Direccion').value;

    usuarioController.actualizarUsuario(user_id, nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion)
        .then((actualizacionExitosa) => {
            if (actualizacionExitosa) {
                // Puedes realizar acciones adicionales aquí, como mostrar un Sweet Alert.
                Swal.fire({
                    title: 'Usuario actualizado',
                    text: 'El usuario se ha actualizado con éxito.',
                    icon: 'success',
                });
            }
        });
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

async function obtenerRutaFotoAnterior(user_id) {
    const sql = 'SELECT imgPerfilUrl FROM usuarios WHERE id = ?';
    const values = [user_id];

    return new Promise((resolve, reject) => {
        db.connection.query(sql, values, (queryErr, results) => {
            if (queryErr) {
                console.error('Error al consultar la base de datos: ' + queryErr.message);
                reject(queryErr);
            } else {
                if (results.length > 0) {
                    // Se encontró una ruta de foto anterior
                    resolve(results[0].imgPerfilUrl);
                    
                } else {
                    // No se encontró una ruta de foto anterior
                    resolve(null);
                }
            }
        });
    });
}

function eliminarFotoAnterior(rutaFotoAnterior) {
    const rutaAbsoluta = path.join(__dirname, rutaFotoAnterior);
    console.log('Intentando eliminar la foto anterior en la ruta absoluta:', rutaAbsoluta);
    if (fs.existsSync(rutaAbsoluta)) {
        try {
            fs.unlinkSync(rutaAbsoluta);
            console.log('Imagen anterior eliminada con éxito.');
        } catch (error) {
            console.error('Error al eliminar la foto anterior:', error);
        }
    } else {
        console.log('La imagen anterior no existe en la ruta:', rutaAbsoluta);
    }
}

module.exports = {
    actualizarUsuario,
};
