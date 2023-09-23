// Aqui importamos el modulo mysql2 
const mysql = require('mysql2');

// Configuramos la conexión ala base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: '', 
  database: 'cloverwingsbd' 
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

// Aqui exportamos la conexion para usarla en otros archivos
module.exports = {
  connection,
};

// ===== COMPROBAR LA CONEXION ALA BASE DE DATOS
/*
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');

    // Realiza la consulta SQL para seleccionar todos los registros de la tabla usuarios
    const sql = 'SELECT id, usuario, contrasena, correo FROM usuarios';

    connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al realizar la consulta: ' + queryErr.message);
        return;
      }

      // Imprime los resultados en el mismo console.log
      console.log('Datos de la tabla usuarios:');
      console.table(results); // Imprime los resultados en forma de tabla
    });
  }
});
*/
