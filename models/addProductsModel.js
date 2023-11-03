const db = require('../database/db');

async function insertarPlatillo(nombrePlatillo, categoria, descripcionPlatillo, precio, fecha_creacion, imagenUrlPlatillo) {
    // Validación para campos vacíos
    if (!nombrePlatillo || !precio || !fecha_creacion) {
        return Promise.reject(false); // Rechazamos la promesa si hay campos vacíos
    }

    const sql = 'INSERT INTO platillos (nombrePlatillo, categoria, descripcionPlatillo, precio, fecha_creacion, imagenUrlPlatillo) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nombrePlatillo, categoria, descripcionPlatillo, precio, fecha_creacion, imagenUrlPlatillo];

    return new Promise((resolve, reject) => {
        db.connection.query(sql, values, (queryErr, results) => {
            if (queryErr) {
                console.error('Error al insertar el platillo: ' + queryErr.message);
                reject(false);
            } else {
                if (results.affectedRows === 1) {
                    console.log('Platillo registrado con éxito');
                    resolve(true);
                } else {
                    console.error('No se pudo registrar el platillo');
                    reject(false);
                }
            }
        });
    });
}

module.exports = {
    insertarPlatillo
};
