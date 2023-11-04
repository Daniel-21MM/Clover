// Asumiendo que ya tienes una función para conectarte a la base de datos
const db = require('../database/db');

function obtenerOpcionesPlatillos() {
    const sql = 'SELECT nombrePlatillo, precio FROM platillos'; // Agregamos el precio a la consulta
    return new Promise((resolve, reject) => {
      db.connection.query(sql, (queryErr, results) => {
        if (queryErr) {
          console.error('Error al obtener platillos: ' + queryErr.message);
          reject([]);
        } else {
          resolve(results); // Devolvemos todos los resultados
        }
      });
    });
  }
  

module.exports = {
  obtenerOpcionesPlatillos
};
