const db = require('../database/db');
const fs = require('fs');
const path = require('path');

async function obtenerDatosMesasDesdeBD(consultaSQL) {
    return new Promise((resolve, reject) => {
        db.connection.query(consultaSQL, (err, results) => {
            if (err) {
                console.error('Error al obtener datos de mesas: ' + err.message);
                reject(err);
                return;
            }

            resolve(results);
        });
    });
}

async function eliminarMesa(idMesa) {
    return new Promise((resolve, reject) => {
        const consultaSQL = 'DELETE FROM mesas WHERE idMesas = ?';

        db.connection.query(consultaSQL, [idMesa], (err) => {
            if (err) {
                console.error('Error al eliminar la mesa: ' + err.message);
                reject(err);
                return;
            }

            resolve();
        });
    });
}

async function obtenerMesaPorID(idMesa) {
    return new Promise((resolve, reject) => {
        const consultaSQL = 'SELECT * FROM mesas WHERE idMesas = ?';
        console.log('ID de la mesa a eliminar o actualizar: ', idMesa);
        db.connection.query(consultaSQL, [idMesa], (err, results) => {
            if (err) {
                console.error('Error al obtener los datos de la mesa: ' + err.message);
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
    obtenerDatosMesasDesdeBD,
    eliminarMesa,
    obtenerMesaPorID,
    eliminarImagen,
};
