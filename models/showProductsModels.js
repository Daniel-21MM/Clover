const db = require('../database/db');
const fs = require('fs');
const path = require('path');

async function obtenerDatosPlatillosDesdeBD(consultaSQL) {
    return new Promise((resolve, reject) => {
        db.connection.query(consultaSQL, (err, results) => {
            if (err) {
                console.error('Error al obtener datos de platillos: ' + err.message);
                reject(err);
                return;
            }

            resolve(results);
        });
    });
}

async function eliminarPlatillo(idPlatillo) {
    return new Promise((resolve, reject) => {
        const consultaSQL = 'DELETE FROM platillos WHERE id = ?';

        db.connection.query(consultaSQL, [idPlatillo], (err) => {
            if (err) {
                console.error('Error al eliminar el platillo: ' + err.message);
                reject(err);
                return;
            }

            resolve();
        });
    }); // Agrega un paréntesis de cierre aquí
}


async function obtenerPlatilloPorID(idPlatillo) {
    return new Promise((resolve, reject) => {
        const consultaSQL = 'SELECT * FROM platillos WHERE id = ?';
        console.log('ID del platillo a eliminar o actualizar: ', idPlatillo);
        db.connection.query(consultaSQL, [idPlatillo], (err, results) => {
            if (err) {
                console.error('Error al obtener los datos del platillo: ' + err.message);
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
    obtenerDatosPlatillosDesdeBD,
    eliminarPlatillo,
    obtenerPlatilloPorID,
    eliminarImagen,
};
