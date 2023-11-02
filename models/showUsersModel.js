const db = require('../database/db');
const fs = require('fs');
const path = require('path');

async function formatearTelefono(telefono) {
    const telefonoStr = telefono.toString();
    return telefonoStr.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4');
}

async function obtenerDatosUsuariosDesdeBD(consultaSQL) {
    return new Promise((resolve, reject) => {
        db.connection.query(consultaSQL, (err, results) => {
            if (err) {
                console.error('Error al obtener datos de usuarios: ' + err.message);
                reject(err);
                return;
            }

            resolve(results);
        });
    });
}

async function eliminarUsuario(idUsuario) {
    return new Promise((resolve, reject) => {
        const consultaSQL = 'DELETE FROM usuarios WHERE id = ?';

        db.connection.query(consultaSQL, [idUsuario], (err) => {
            if (err) {
                console.error('Error al eliminar el usuario: ' + err.message);
                reject(err);
                return;
            }

            resolve();
        });
    });
}

async function obtenerUsuarioPorID(idUsuario) {
    return new Promise((resolve, reject) => {
        const consultaSQL = 'SELECT * FROM usuarios WHERE id = ?';
        db.connection.query(consultaSQL, [idUsuario], (err, results) => {
            if (err) {
                console.error('Error al obtener los datos del usuario: ' + err.message);
                reject(err);
                return;
            }

            if (results.length > 0) {
                resolve(results[0]);
            } else {
                resolve(null);
            }
        });
    });
}

async function eliminarImagen(rutaImagen) {
    return new Promise((resolve, reject) => {
        const rutaAbsoluta = path.join(__dirname, rutaImagen);
        fs.unlink(rutaAbsoluta, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    formatearTelefono,
    obtenerDatosUsuariosDesdeBD,
    eliminarUsuario,
    obtenerUsuarioPorID,
    eliminarImagen,
};