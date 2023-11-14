const fs = require('fs');
const path = require('path');
const db = require('../database/db');

async function guardarImagen(archivo, rutaImagenAnterior) {
    return new Promise(async (resolve, reject) => {
        const rutaCarpeta = path.join(__dirname, '../assets/imgLogo/');
        const extension = path.extname(archivo.name);
        const nombreArchivo = `imgEmpresa_${Date.now()}${extension}`;

        // Si se proporciona una nueva imagen y no es la misma que la anterior, elimina la imagen anterior
        if (archivo && archivo.name !== rutaImagenAnterior) {
            eliminarImagenAnterior(rutaImagenAnterior);
            const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

            fs.copyFile(archivo.path, rutaCompleta, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('../assets/imgLogo/' + nombreArchivo);
                }
            });
        } else {
            // Si no se proporciona una nueva imagen, simplemente conserva la imagen anterior
            resolve(rutaImagenAnterior);
        }
    });
}

async function actualizarDatosEmpresa(id, nombreEmpresa, direccionEmpresa, telefonoEmpresa, emailEmpresa, detallesEmpresa, imgUrl) {
    const sql = 'UPDATE datosEmpresa SET nombreEmpresa=?, direccionEmpresa=?, telefonoEmpresa=?, emailEmpresa=?, detallesEmpresa=?, imgUrl=? WHERE id=?';
    const values = [nombreEmpresa, direccionEmpresa, telefonoEmpresa, emailEmpresa, detallesEmpresa, imgUrl, id];

    return new Promise((resolve, reject) => {
        db.connection.query(sql, values, async (queryErr, results) => {
            if (queryErr) {
                console.error('Error al actualizar los datos de la empresa: ' + queryErr.message);
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
    const rutaCarpeta = path.join(__dirname, '../assets/imgLogo/');
    const archivos = fs.readdirSync(rutaCarpeta);
    const imagenes = archivos.filter((archivo) =>
        archivo.toLowerCase().endsWith('.jpg') ||
        archivo.toLowerCase().endsWith('.jpeg') ||
        archivo.toLowerCase().endsWith('.png')
    );

    return imagenes.length;
}

async function obtenerDatosEmpresa(id) {
    const sql = 'SELECT * FROM datosEmpresa WHERE id = ?';
    const values = [id];

    return new Promise((resolve, reject) => {
        db.connection.query(sql, values, (queryErr, results) => {
            if (queryErr) {
                console.error('Error al consultar la base de datos: ' + queryErr.message);
                reject(queryErr);
            } else {
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

async function obtenerRutaImagenAnterior(id) {
    const sql = 'SELECT imgUrl FROM datosEmpresa WHERE id = ?';
    const values = [id];

    return new Promise((resolve, reject) => {
        db.connection.query(sql, values, (queryErr, results) => {
            if (queryErr) {
                console.error('Error al consultar la base de datos: ' + queryErr.message);
                reject(queryErr);
            } else {
                if (results.length > 0) {
                    resolve(results[0].imgUrl);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

async function eliminarImagenAnterior(rutaImagenAnterior) {
    const rutaAbsoluta = path.join(__dirname, rutaImagenAnterior);
    if (fs.existsSync(rutaAbsoluta)) {
        try {
            fs.unlinkSync(rutaAbsoluta);
            console.log('Imagen anterior eliminada con éxito.');
        } catch (error) {
            console.error('Error al eliminar la imagen anterior:', error);
        }
    } else {
        console.log('La imagen anterior no existe en la ruta:', rutaAbsoluta);
    }
}

module.exports = {
    guardarImagen,
    actualizarDatosEmpresa,
    obtenerNumeroDeImagenes,
    obtenerDatosEmpresa,
    obtenerRutaImagenAnterior,
    eliminarImagenAnterior,
};
