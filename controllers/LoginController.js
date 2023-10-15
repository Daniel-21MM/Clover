const db = require('../database/db');
const Swal = require('sweetalert2');

function loginUsuario(usuario, contrasena) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';

    db.connection.query(sql, [usuario, contrasena], (queryErr, results) => {
      if (queryErr) {
        console.error('Error al realizar la consulta: ' + queryErr.message);
        // Muestra una alerta SweetAlert cuando ocurre un error en la consulta
        Swal.fire({
          icon: 'error',
          title: '¡Oh, no!',
          text: 'Se ha producido un error al iniciar sesion, inténtalo más tarde.',
        });
        return reject(queryErr);
      }

      if (results.length === 1) {
        const usuarioEncontrado = results[0];
        resolve(usuarioEncontrado);
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Datos incorrectos!',
          text: 'Verifica tus credenciales',
        });
        reject(new Error('Credenciales incorrectas'));
      }
    });
  });
}

module.exports = {
  loginUsuario,
};
