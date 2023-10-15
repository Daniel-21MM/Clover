// const db = require('../database/db'); // Importa la conexión a la base de datos desde db.js

// function insertarUsuario(usuario, contrasena, correo) {
//   return new Promise((resolve, reject) => {
//     // Realiza la consulta SQL para insertar un nuevo usuario en la tabla usuarios
//     const sql = 'INSERT INTO usuarios (usuario, contrasena, correo) VALUES (?, ?, ?)';

//     db.connection.query(sql, [usuario, contrasena, correo], (queryErr, results) => {
//       if (queryErr) {
//         console.error('Error al insertar usuario: ' + queryErr.message);
//         return reject(queryErr);
//       }

//       // Si la inserción se realizó con éxito, resolvemos la promesa
//       resolve(results);
//     });
//   });
// }

// module.exports = {
//   insertarUsuario,
// };

