const { ipcRenderer } = require('electron');
const usuarios = require('../controllers/LoginController');
const Swal = require('sweetalert2');

document.addEventListener('DOMContentLoaded', () => {
  const usuarioInput = document.getElementById('usuario');
  const contrasenaInput = document.getElementById('contrasena');
  const iniciarSesionButton = document.getElementById('Iniciar');

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
        if (resultadoInicioSesion.rol === 1) {
          // Mostrar una alerta de bienvenida
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
          }).then(() => {
            // Si el rol es 1 (administrador), abrir la ventana de inicio
            ipcRenderer.send('abrirVentanaInicio');
            // Cerrar la ventana actual (index.html)
            ipcRenderer.send('cerrarVentanaActual');
          });
        } else {
          // Mostrar una alerta de bienvenida
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
          }).then(() => {
            // Si el rol no es 1, abrir la ventana de empleados
            ipcRenderer.send('abrirVentanaEmpleados');
            // Cerrar la ventana actual (index.html)
            ipcRenderer.send('cerrarVentanaActual');
          });
        }
      } else {
        // Mostrar una alerta de datos incorrectos
        Swal.fire({
          icon: 'error',
          title: '¡Datos Incorrectos!',
          text: 'Verifica tus credenciales',
        }).then(() => {
          // Restablecer los campos de entrada a una cadena vacía
          usuarioInput.value = '';
          contrasenaInput.value = '';
        });
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error.message);
    }
  });
});



