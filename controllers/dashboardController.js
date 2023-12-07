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

async function obtenerVentasPorDia() {
  const sql = 'SELECT DATE(fechaHora) as fecha, COUNT(*) as totalVentas FROM ventas GROUP BY fecha ORDER BY fecha DESC';
  
  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener el número de ventas por día: ' + queryErr.message);
        reject([]);
      } else {
        resolve(results);
      }
    });
  });
}

async function obtenerGananciasPorDia() {
  const sql = 'SELECT DATE(fechaHora) as fecha, SUM(totalGanancia) as totalGanancias FROM ventas GROUP BY fecha ORDER BY fecha DESC';
  
  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener el total de ganancias por día: ' + queryErr.message);
        reject([]);
      } else {
        resolve(results);
      }
    });
  });
}

async function obtenerVentasPorDosDias() {
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);

  const formatoFecha = (fecha) => {
    return fecha.toISOString().split('T')[0];
  };
  

  const sql = `
  SELECT DATE(fechaHora) as fecha, COUNT(*) as totalVentas
  FROM ventas
  WHERE DATE(fechaHora) >= CURDATE() - INTERVAL 1 DAY
  AND DATE(fechaHora) < CURDATE()
  GROUP BY fecha
  ORDER BY fecha DESC
`;


  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener el número de ventas por día: ' + queryErr.message);
        reject([]);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  obtenerNumeroRegistros,
  obtenerVentasPorDia,
  obtenerGananciasPorDia,
  obtenerVentasPorDia,
  obtenerVentasPorDosDias
};

