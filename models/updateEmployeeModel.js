const fs = require('fs');
const path = require('path');
const db = require('../database/db');

async function guardarImagen(archivo) {
    return new Promise((resolve, reject) => {
        const rutaCarpeta = path.join(__dirname, '../assets/imgUsers/');
        const extension = path.extname(archivo.name); // Obtén la extensión del archivo
        const nombreArchivo = `imgPerfil_${Date.now()}${extension}`; // Nombre único con sello de tiempo
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


async function actualizarUsuario(user_id, nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion) {
    const sql = 'UPDATE usuarios SET nombre=?, telefono=?, usuario=?, contrasena=?, correo=?, rol=?, imgPerfilUrl=?, direccion=? WHERE id=?';
    const values = [nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, user_id];

    return new Promise((resolve, reject) => {
        db.connection.query(sql, values, async (queryErr, results) => {
            if (queryErr) {
                console.error('Error al actualizar el usuario: ' + queryErr.message);
                reject(false);
            } else {
                if (results.affectedRows === 1) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }
        });
    });
}

async function obtenerNumeroDeImagenes() {
    const rutaCarpeta = path.join(__dirname, '../assets/imgUsers/');
    const archivos = fs.readdirSync(rutaCarpeta);
    const imagenes = archivos.filter((archivo) =>
        archivo.toLowerCase().endsWith('.jpg') ||
        archivo.toLowerCase().endsWith('.jpeg') ||
        archivo.toLowerCase().endsWith('.png')
    );

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
                    resolve(results[0].imgPerfilUrl);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

async function eliminarFotoAnterior(rutaFotoAnterior) {
    const rutaAbsoluta = path.join(__dirname, rutaFotoAnterior);
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
    guardarImagen,
    actualizarUsuario,
    obtenerNumeroDeImagenes,
    obtenerRutaFotoAnterior,
    eliminarFotoAnterior,
};
