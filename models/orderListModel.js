const db = require('../database/db');

async function obtenerDatosPedidosDesdeBD(consultaSQL) {
    return new Promise((resolve, reject) => {
        db.connection.query(consultaSQL, (err, results) => {
            if (err) {
                console.error('Error al obtener datos de pedidos: ' + err.message);
                reject(err);
                return;
            }

            resolve(results);
        });
    });
}

module.exports = {
    obtenerDatosPedidosDesdeBD
};
