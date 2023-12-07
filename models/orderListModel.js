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


async function obtenerPedidoPorID(idPedido) {
    return new Promise((resolve, reject) => {
        const consultaSQL = 'SELECT * FROM pedidos WHERE idPedido = ?';
        console.log('ID del pedido a eliminar o actualizar: ', idPedido);
        db.connection.query(consultaSQL, [idPedido], (err, results) => {
            if (err) {
                console.error('Error al obtener los datos del pedido: ' + err.message);
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

module.exports = {
    obtenerDatosPedidosDesdeBD,
    obtenerPedidoPorID
};
