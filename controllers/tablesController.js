const db = require('../database/db');

function obtenerOpcionesPlatillos() {
  const sql = 'SELECT nombrePlatillo, precio FROM platillos';
  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener platillos: ' + queryErr.message);
        reject([]);
      } else {
        const opcionesPlatillos = results.map(opcion => ({
          nombrePlatillo: opcion.nombrePlatillo,
          precio: opcion.precio
        }));
        resolve(opcionesPlatillos);
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
function guardarPedido(numeroMesa, nombreCliente, detallesPedido, descuento, fechaHora) {
  const sql = 'INSERT INTO pedidos (numeroMesa, nombreCliente, DetallesPedidos, Descuento, fechaHora) VALUES (?, ?, ?, ?, ?)';

  // Convertir detallesPedido a una cadena de texto
  const detallesPedidoString = JSON.stringify(detallesPedido);

  const values = [numeroMesa, nombreCliente, detallesPedidoString, descuento, fechaHora];

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
function obtenerDetallesPedido(numeroMesa) {
  // Realizar la consulta a la base de datos para obtener los detalles del pedido
  const sql = 'SELECT nombreCliente, DetallesPedidos, Descuento, fechaHora FROM pedidos WHERE numeroMesa = ?';
  const values = [numeroMesa];

  return new Promise((resolve, reject) => {
    db.connection.query(sql, values, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener detalles del pedido: ' + queryErr.message);
        reject(queryErr.message);
      } else {
        // Convertir DetallesPedidos de cadena de texto a array
        const detallesPedido = results[0];
        detallesPedido.DetallesPedidos = JSON.parse(detallesPedido.DetallesPedidos);
        resolve(detallesPedido);
      }
    });
  });
}

module.exports = {
  obtenerMesas,
  actualizarEstadoMesa,
  guardarPedido,
  obtenerDetallesPedido,
  obtenerOpcionesPlatillos
};
