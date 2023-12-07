// Aqui importamos el modulo mysql2 
const mysql = require('mysql2');

// Configuramos la conexión ala base de datos MySQL
const connection = mysql.createConnection({
  host: 'b3pktkex5xv1rqhte0ht-mysql.services.clever-cloud.com', 
  user: 'uhlnf3rrmexpvqmb',
  password: 'b0qCqrdf2ouRbL7EDzA9', 
  database: 'b3pktkex5xv1rqhte0ht'
});

// Conectamos a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('¡Error al conectar a la base de datos!: ' + err.message);
  } else {
    console.log('¡Conexion exitosa a la base de datos MySQL!');
  }
});

// Aqui exportamos la conexion para usarla en otros archivos
module.exports = {
  connection,
};
