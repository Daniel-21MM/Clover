// En tu archivo dashboardModel.js
const db = require('../database/db');

function obtenerNumeroRegistros(tabla, condicion = '') {
  const sql = `SELECT COUNT(*) as totalRegistros FROM ${tabla} ${condicion ? `WHERE ${condicion}` : ''}`;
  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error(`Error al obtener el número de registros de ${tabla}: ${queryErr.message}`);
        reject(0);
      } else {
        const totalRegistros = results[0].totalRegistros;
        resolve(totalRegistros);
      }
    });
  });
}

module.exports = {
  obtenerNumeroRegistros
};

