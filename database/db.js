// Aqui importamos el modulo mysql2 
const mysql = require('mysql2');

// Configuramos la conexión ala base de datos MySQL
const connection = mysql.createConnection({
  host: 'us-east.connect.psdb.cloud', 
  user: 'cqgk5rqn5izkyaf4c9a5',
  password: 'pscale_pw_J8DYbe6Slzvi150IqUt61ZeM5JAHNrLi0CeGg8Qi12W', 
  database: 'cloverwingsdb',
  ssl:{
    rejectUnauthorized: false
  }
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
