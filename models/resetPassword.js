const nodemailer = require('nodemailer');
const db = require('../database/db'); // Importa la conexión a la base de datos desde db.js

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'danielsanz8001@gmail.com',
      pass: 'aujrkzioxtpdjwbu',
    },
  });
};

const sendEmail = () => {
  const transporter = createTransporter();

  // Consulta la base de datos para obtener usuario, contraseña y correo electrónico filtrando por ID
  const userId = 1; // ID del usuario que deseas obtener
  db.connection.query('SELECT usuario, contrasena, correo FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return;
    }

    if (results.length === 0) {
      console.error('Usuario no encontrado');
      return;
    }

    const usuario = results[0].usuario;
    const contrasena = results[0].contrasena;
    const correoDestinatario = results[0].correo; // Obtén la dirección de correo electrónico desde la base de datos

    const mailOptions = {
      from: 'Clover Wings App',
      to: correoDestinatario, // Utiliza la dirección de correo electrónico del usuario obtenida desde la base de datos
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

        // Notificar al proceso principal que el correo se ha enviado
        ipcRenderer.send('email-sent');
      }
    });
  });
};

window.sendEmail = function () {
  sendEmail();
};
