const db = require('../database/db');

function guardarImagen(imagenBuffer) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO imagenes (imagen) VALUES (?)';
        db.connection.query(sql, [imagenBuffer], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.insertId);
            }
        });
    });
}

module.exports = {
    guardarImagen,
};
