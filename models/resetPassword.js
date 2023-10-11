const nodemailer = require('nodemailer');
const db = require('../database/db'); // Importa la conexión a la base de datos desde db.js

// Define la función para crear el transporte de correo
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'danielsanz8001@gmail.com', // Coloca tu dirección de correo electrónico de Gmail
      pass: 'aujrkzioxtpdjwbu', // Coloca tu contraseña de Gmail
    },
  });
};

// Define la función para enviar el correo electrónico
const sendEmail = (email, usuario, contrasena) => {
  const transporter = createTransporter();

  // Verifica que el correo electrónico no esté vacío
  if (!email) {
    console.error('El correo electrónico no puede estar vacío.');
    return;
  }

  const mailOptions = {
    from: 'Clover Wings App',
    to: email, // Utiliza el correo electrónico proporcionado por el usuario
    subject: 'Restablecer Contraseña',
    html: `<p>Estimado usuario de Clover Wings App</p>
           <p>Le informamos que su contraseña de inicio de sesión ha sido restablecida con éxito.
           A continuación, encontrará los detalles de su cuenta:</p>
           <p><b>Usuario: ${usuario}</b></p>
           <p><b>Contraseña: ${contrasena}</b></p>
           <p>Por motivos de seguridad, le recomendamos no compartir su contraseña con nadie. Si no solicitó este restablecimiento de contraseña, póngase en contacto con nuestro equipo de soporte de inmediato.</p>
           <p>Gracias por confiar en Clover Wings App. ¡Esperamos que disfrute de nuestra plataforma!</p>
           <p>Atentamente:<br>El Equipo de Soporte de Clover Wings App.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      // Mostrar una alerta de error
      Swal.fire('Error', 'Error al restablecer la contraseña', 'error');
    } else {
      console.log('Correo enviado con éxito:', info.response);
      // Mostrar una alerta de éxito
      Swal.fire('Contraseña Restablecida', 'Revise su correo electrónico', 'success');

      // Notificar al proceso principal que el correo se ha enviado (si es necesario)
      // ipcRenderer.send('email-sent');
    }
  });
};

// Agrega un manejador de eventos para el evento "submit" del formulario
document.getElementById('form-create-account').addEventListener('submit', function (event) {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  const email = document.getElementById('correo').value; // Obtiene el correo electrónico ingresado

  // Realiza una consulta a la base de datos para obtener usuario y contraseña basado en el correo electrónico
  // Asegúrate de tener la conexión a la base de datos configurada correctamente y adaptada a tu sistema
  const userIdQuery = 'SELECT usuario, contrasena FROM usuarios WHERE correo = ?';

  // Ejecuta la consulta
  db.connection.query(userIdQuery, [email], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      // Muestra un mensaje de error al usuario
      Swal.fire('Error', 'Error al consultar la base de datos', 'error');
      return;
    }

    // Verifica si se encontró un usuario con el correo electrónico proporcionado
    if (results.length === 0) {
      console.error('Usuario no encontrado');
      // Muestra un mensaje de error al usuario
      Swal.fire('¡Error!', 'No se encontró un usuario con ese correo electrónico', 'error');
      return;
    }

    // Obtiene los datos del usuario y la contraseña desde la consulta
    const usuario = results[0].usuario;
    const contrasena = results[0].contrasena;

    // Llama a sendEmail con los datos obtenidos de la base de datos
    sendEmail(email, usuario, contrasena);
  });
});
