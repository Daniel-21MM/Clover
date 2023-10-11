// const registerUsers = require('../controllers/registerUserController');m

// document.addEventListener('DOMContentLoaded', () => {
//   const usuarioRegisterInput = document.getElementById('usuarioRegistrar');
//   const correoRegisterInput = document.getElementById('correo');
//   const contrasenaRegisterInput = document.getElementById('contrasenaRegistrar');
//   const registrarUsuarioButton = document.getElementById('RegistrarUsuario');

//   registrarUsuarioButton.addEventListener('click', async () => {
//     const usuario = usuarioRegisterInput.value;
//     const correo = correoRegisterInput.value;
//     const contrasena = contrasenaRegisterInput.value;

//     // Validar campos vacíos
//     if (!usuario || !correo || !contrasena) {
//       console.log('Campos vacíos');
//       return;
//     }

//     try {
//       const resultadoRegistro = await registerUsers.insertarUsuario(usuario, contrasena, correo);

//       if (resultadoRegistro) {
//         // Mostrar una alerta de registro exitoso
//         Swal.fire({
//           icon: 'success',
//           title: '¡Registro exitoso!',
//           text: 'Tu cuenta ha sido creada con éxito.',
//         }).then(() => {
//           // Después de cerrar la alerta de registro exitoso, abrir la ventana principal o realizar otras acciones
//           // Puedes utilizar ipcRenderer.send para comunicarte con el proceso principal si es necesario
//           // Limpiar campos de entrada
//           usuarioRegisterInput.value = '';
//           correoRegisterInput.value = '';
//           contrasenaRegisterInput.value = '';
//         });
//       } else {
//         // Mostrar alerta de error en el registro
//         Swal.fire({
//           icon: 'error',
//           title: 'Error en el registro',
//           text: 'No se pudo crear la cuenta. Verifica los datos ingresados.',
//         });
//       }
//     } catch (error) {
//       console.error('Error de registro:', error.message);
//     }
//   });
// });