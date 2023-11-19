
  const { ipcRenderer } = require('electron');
 

  document.addEventListener('DOMContentLoaded', () => {
    const btnSalirEmpleado = document.getElementById('btnSalirEmpleado');

    btnSalirEmpleado.addEventListener('click', async () => {
      // Mostrar SweetAlert de confirmación
      const confirmacion = await mostrarConfirmacion();

      // Si el usuario confirma, enviamos el mensaje para cerrar la ventana
      if (confirmacion.value) {
        ipcRenderer.send('btnSalirEmpleadoClick');
      }
    });

    // Función para mostrar el SweetAlert de confirmación
    function mostrarConfirmacion() {
      return Swal.fire({
        title: '¿Estás seguro de salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#049935',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
      });
    }
  });


