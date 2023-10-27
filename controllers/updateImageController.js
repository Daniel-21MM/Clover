const fs = require('fs');
const path = require('path');
const db = require('../database/db'); // Asegúrate de importar db correctamente

function guardarImagen(imagenBuffer, usuario_id) {
    return new Promise((resolve, reject) => {
        const nombreDeArchivoUnico = `imagenPerfil_${usuario_id}_${Date.now()}.jpg`;

        const rutaImagen = path.join(__dirname, '../assets/imgUsers/', nombreDeArchivoUnico); // Corregimos la ruta absoluta

        fs.writeFile(rutaImagen, imagenBuffer, (err) => {
            if (err) {
                reject(err);
            } else {
                const sql = 'UPDATE usuarios SET imgPerfilUrl = ? WHERE id = ?';
                db.connection.query(sql, [rutaImagen, usuario_id], (dbErr, results) => {
                    if (dbErr) {
                        reject(dbErr);
                    } else {
                        resolve(results.changedRows > 0);
                    }
                });
            }
        });
    });
}

module.exports = {
    guardarImagen,
};
