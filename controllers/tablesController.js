const db = require('../database/db');

function obtenerMesas() {
  const sql = 'SELECT * FROM mesas';
  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener mesas: ' + queryErr.message);
        reject([]);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  obtenerMesas
};
