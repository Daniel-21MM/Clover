const db = require('../database/db');

function guardarImagen(imagenBuffer, usuario_id) {
    return new Promise((resolve, reject) => {
        // Genera un nombre de archivo único (por ejemplo, usando un ID de usuario o un nombre aleatorio)
        const nombreDeArchivoUnico = 'imagenPerfil';

        // Define la ruta de la imagen en la carpeta "assets"
        const rutaImagen = `./assets/imgUsers/${nombreDeArchivoUnico}.jpg`;

        // Guarda la imagen en la carpeta "assets"
        fs.writeFile(rutaImagen, imagenBuffer, (err) => {
            if (err) {
                reject(err);
            } else {
                // Actualiza la ruta de la imagen en la base de datos para el usuario especificado
                const sql = 'UPDATE usuarios SET imgPerfilUrl = ? WHERE id = ?';
                db.connection.query(sql, [rutaImagen, usuario_id], (dbErr, results) => {
                    if (dbErr) {
                        reject(dbErr);
                    } else {
                        resolve(results.changedRows > 0); // Devuelve verdadero si se realizó una actualización
                    }
                });
            }
        });
    });
}

module.exports = {
    guardarImagen,
};

