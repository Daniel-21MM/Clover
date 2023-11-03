const db = require('../database/db');

async function insertarMesa(numeroMesa, estado, descripcion, capacidad, fecha_creacion, imgMesaUrl) {
    // Validación para campos vacíos
    if (!numeroMesa || !fecha_creacion) {
        return Promise.reject(false); // Rechazamos la promesa si hay campos vacíos
    }

    const sql = 'INSERT INTO mesas (numeroMesa, estado, descripcion, capacidad, fecha_creacion, imgMesaUrl) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [numeroMesa, estado, descripcion, capacidad, fecha_creacion, imgMesaUrl];

    return new Promise((resolve, reject) => {
        db.connection.query(sql, values, (queryErr, results) => {
            if (queryErr) {
                console.error('Error al insertar la mesa: ' + queryErr.message);
                reject(false);
            } else {
                if (results.affectedRows === 1) {
                    console.log('Mesa registrada con éxito');
                    resolve(true);
                } else {
                    console.error('No se pudo registrar la mesa');
                    reject(false);
                }
            }
        });
    });
}

module.exports = {
    insertarMesa
};
