const db = require('../database/db');
const fs = require('fs');
const path = require('path');

async function obtenerDatosVentsasDesdeBD(consultaSQL) {
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


module.exports = {
    obtenerDatosVentsasDesdeBD
};
