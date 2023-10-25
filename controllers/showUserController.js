const db = require('../database/db');

function obtenerDatosUsuariosDesdeBD(consultaSQL) {
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

function eliminarUsuario(idUsuario) {
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

module.exports = {
    obtenerDatosUsuariosDesdeBD,
    eliminarUsuario,
};
