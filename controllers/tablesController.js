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

async function guardarPedido(numeroMesa, nombreCliente, detallesPedido, descuento, fechaHora) {
  const estadoInicial = 'En proceso';
  const estadoFinalizado = 'Finalizado';

  try {
    // Verificar si hay un pedido en proceso para la mesa
    const pedidoEnProceso = await obtenerUltimoPedidoEnProceso(numeroMesa);

    if (pedidoEnProceso) {
      // Si hay un pedido en proceso, actualizar el pedido existente
      const sql = 'UPDATE pedidos SET nombreCliente = ?, DetallesPedidos = ?, Descuento = ?, fechaHora = ? WHERE numeroMesa = ? AND estado = ?';
      const values = [nombreCliente, JSON.stringify(detallesPedido), descuento, fechaHora, numeroMesa, estadoInicial];

      return new Promise((resolve, reject) => {
        db.connection.query(sql, values, (queryErr, results) => {
          if (queryErr) {
            console.error('Error al actualizar el pedido: ' + queryErr.message);
            reject(queryErr.message);
          } else {
            resolve(results);
          }
        });
      });
    } else {
      // Si no hay un pedido en proceso, insertar un nuevo pedido
      const sql = 'INSERT INTO pedidos (numeroMesa, nombreCliente, DetallesPedidos, Descuento, fechaHora, estado) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [numeroMesa, nombreCliente, JSON.stringify(detallesPedido), descuento, fechaHora, estadoInicial];

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
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    throw error;
  }
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
        // Manejar el caso en que DetallesPedidos no es un JSON válido
        let detallesPedido = results[0];
        try {
          detallesPedido.DetallesPedidos = JSON.parse(detallesPedido.DetallesPedidos);
        } catch (jsonError) {
          console.error('Error al parsear DetallesPedidos como JSON:', jsonError);
          detallesPedido.DetallesPedidos = []; // Puedes manejar esto según tus necesidades
        }
        resolve(detallesPedido);
      }
    });
  });
}

async function obtenerEstadoPedido(numeroMesa) {
  // Realizar la consulta a la base de datos para obtener el estado del pedido
  const sql = 'SELECT estado FROM pedidos WHERE numeroMesa = ?';
  const values = [numeroMesa];

  return new Promise((resolve, reject) => {
    db.connection.query(sql, values, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener estado del pedido:', queryErr.message);
        reject(queryErr.message);
      } else {
        // Devolver el estado del pedido
        const estadoPedido = results[0] ? results[0].estado : null;
        resolve(estadoPedido);
      }
    });
  });
}
function actualizarEstadoPedido(numeroMesa, nuevoEstado) {
  const sql = 'UPDATE pedidos SET estado = ? WHERE numeroMesa = ?';
  const values = [nuevoEstado, numeroMesa];

  return new Promise((resolve, reject) => {
    db.connection.query(sql, values, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al actualizar el estado del pedido: ' + queryErr.message);
        reject(queryErr.message);
      } else {
        resolve(results);
      }
    });
  });
}
// Función para obtener el último pedido en proceso asociado a una mesa
async function obtenerUltimoPedidoEnProceso(numeroMesa) {
  try {
    // Realizar la consulta a la base de datos para obtener el último pedido en proceso
    const sql = 'SELECT * FROM pedidos WHERE numeroMesa = ? AND estado = "En proceso" ORDER BY fechaHora DESC LIMIT 1';
    const values = [numeroMesa];

    return new Promise((resolve, reject) => {
      db.connection.query(sql, values, (queryErr, results) => {
        if (queryErr) {
          console.error('Error al obtener el último pedido en proceso:', queryErr);
          reject(queryErr);
        } else {
          // Imprimir en la consola los datos del pedido obtenido
          // console.log('Datos del pedido obtenido:', results.length > 0 ? results[0] : null);

          // Devolver el resultado, si existe
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  } catch (error) {
    console.error('Error al obtener el último pedido en proceso:', error);
    throw error;
  }
}
async function guardarVentaEnTablaVentas(ventaData) {
  const sql = 'INSERT INTO ventas SET ?';

  return new Promise((resolve, reject) => {
    db.connection.query(sql, ventaData, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al insertar en la tabla "ventas": ' + queryErr.message);
        reject(queryErr.message);
      } else {
        resolve(results);
      }
    });
  });
}
function obtenerDatosEmpresa() {
  const sql = 'SELECT * FROM datosempresa';
  
  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener datos de la empresa: ' + queryErr.message);
        reject(null);
      } else {
        const datosEmpresa = results.length > 0 ? results[0] : null;
        resolve(datosEmpresa);
      }
    });
  });
}

module.exports = {
  obtenerMesas,
  actualizarEstadoMesa,
  guardarPedido,
  actualizarEstadoPedido,
  obtenerDetallesPedido,
  obtenerEstadoPedido,
  obtenerUltimoPedidoEnProceso,
  obtenerOpcionesPlatillos,
  guardarVentaEnTablaVentas,
  obtenerDatosEmpresa
};
