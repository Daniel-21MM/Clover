// Aqui importamos el modulo mysql2 
const mysql = require('mysql2');

// Configuramos la conexión ala base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: '', 
  database: 'cloverwingsbd'
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
