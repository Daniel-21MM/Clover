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

function guardarPedido(nombreCliente, detallesPedido, descuento, fechaHora) {
  const sql = 'INSERT INTO pedidos (nombreCliente, DetallesPedidos, Descuento, fechaHora) VALUES (?, ?, ?, ?)';
  const values = [nombreCliente, detallesPedido, descuento, fechaHora];

  return new Promise((resolve, reject) => {
    db.connection.query(sql, values, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al insertar el pedido: ' + queryErr.message);
        reject(queryErr.message);
      } else {
        resolve(results);
      }
    });
  });
}

function actualizarEstadoMesa(numeroMesa, nuevoEstado) {
  const sql = 'UPDATE mesas SET estado = ? WHERE numeroMesa = ?';
  const values = [nuevoEstado, numeroMesa];

  return new Promise((resolve, reject) => {
    db.connection.query(sql, values, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al actualizar el estado de la mesa: ' + queryErr.message);
        reject(queryErr.message);
      } else {
        resolve(results);
      }
    });
  });
}

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
  obtenerMesas,
  obtenerOpcionesPlatillos,
  guardarPedido,
  actualizarEstadoMesa
};
