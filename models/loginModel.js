const { ipcRenderer } = require('electron');
const usuarios = require('../controllers/LoginController');

const Swal = require('sweetalert2');

document.addEventListener('DOMContentLoaded', () => {
  const usuarioInput = document.getElementById('usuario');
  const contrasenaInput = document.getElementById('contrasena');
  const iniciarSesionButton = document.getElementById('Iniciar');

  let eventoConfigurado = false; 

  if (!eventoConfigurado) {
 
    iniciarSesionButton.addEventListener('click', async () => {
      const usuario = usuarioInput.value;
      const contrasena = contrasenaInput.value;

      // Validar campos vacíos
      if (!usuario || !contrasena) {
        console.log("Campos vacíos");
        return;
      }

      try {
        const resultadoInicioSesion = await usuarios.loginUsuario(usuario, contrasena);

        if (resultadoInicioSesion) {
          const rol = resultadoInicioSesion.rol;

          mostrarAlerta('¡Bienvenido!', 'Inicio de sesión exitoso', 'success', () => {
            if (rol === 1) {
              abrirVentana('Inicio');
            } else {
              abrirVentana('Empleados');
            }
          });
        } else {
          mostrarAlerta('¡Datos Incorrectos!', 'Verifica tus credenciales', 'error', () => {
            usuarioInput.value = '';
            contrasenaInput.value = '';
          });
        }
      } catch (error) {
        console.error('Error de inicio de sesión:', error.message);

        if (error.message === 'Credenciales incorrectas') {
          // Mostrar la alerta de "Credenciales Incorrectas" en caso de error de credenciales
          mostrarAlerta('¡Datos Incorrectos!', 'Verifica tus credenciales', 'error', () => {
            usuarioInput.value = '';
            contrasenaInput.value = '';
          });
        } else {
          // Mostrar la alerta de "Error en el servidor" en otros casos de error
          mostrarAlerta('¡Oh, no!', 'Se ha producido un error en el servidor. Inténtalo más tarde.', 'error');
        }
      }
    });

    eventoConfigurado = true;
  }
});

function mostrarAlerta(title, text, icon, callback) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    customClass: {
      title: 'custom-title-class',
      htmlContainer: 'custom-text-class',
    },
    confirmButtonColor: '#049935',
    confirmButtonText: 'Ok',
  }).then(callback);
}

function abrirVentana(ventana) {
  ipcRenderer.send(`abrirVentana${ventana}`);
  ipcRenderer.send('cerrarVentanaActualLogin'); // Nuevo mensaje para cerrar la ventana actual del login
}
