// Función para obtener datos de usuarios desde la base de datos.
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

module.exports = {
    obtenerDatosUsuariosDesdeBD,
};
