const db = require('../database/db'); // Importamos la conexión a la base de datos desde db.js
const Swal = require('sweetalert2'); // Asegúrate de importar Sweet Alert en tu archivo si aún no lo has hecho

function loginUsuario(usuario, contrasena) {
  return new Promise((resolve, reject) => {
    // Realizamos la consulta SQL para seleccionar un registro de la tabla usuarios que coincida con el usuario y la contraseña proporcionados
    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';

    db.connection.query(sql, [usuario, contrasena], (queryErr, results) => {
      if (queryErr) {
        console.error('Error al realizar la consulta: ' + queryErr.message);
        return reject(queryErr);
      }

      if (results.length === 1) {
        // Si se encuentra un registro que coincide, el inicio de sesión es exitoso
        const usuarioEncontrado = results[0];
        
        // Devuelve el objeto de usuario encontrado, incluyendo el rol
        resolve(usuarioEncontrado);
      } else {
        // Si no se encuentra ningún registro, el inicio de sesión falla
        Swal.fire({
          icon: 'error',
          title: '¡Datos incorrectos!',
          text: 'Verifica tus credenciales',
        });

        // También puedes lanzar una excepción personalizada
        reject(new Error('Credenciales incorrectas'));
      }
    });
  });
}

module.exports = {
  loginUsuario,
};
