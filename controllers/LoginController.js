const db = require('../database/db');
const Swal = require('sweetalert2'); 

function loginUsuario(usuario, contrasena) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';

    db.connection.query(sql, [usuario, contrasena], (queryErr, results) => {
      if (queryErr) {
        console.error('Error al realizar la consulta: ' + queryErr.message);
        return reject(queryErr);
      }

      if (results.length === 1) {
        const usuarioEncontrado = results[0];
        resolve(usuarioEncontrado);
      } else {
        reject(new Error('Credenciales incorrectas'));
      }
    });
  });
}

module.exports = {
  loginUsuario,
};
