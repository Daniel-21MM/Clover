const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const btnSalir = document.getElementById('btnSalir');

  btnSalir.addEventListener('click', async () => {
    // Mostrar SweetAlert de confirmación
    const confirmacion = await mostrarConfirmacion();

    // Si el usuario confirma, enviamos el mensaje para cerrar la ventana
    if (confirmacion.value) {
      ipcRenderer.send('btnSalirClick');
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

var table = document.getElementById("miTablaPrincipal");
var tbody = table.getElementsByTagName("tbody")[0];
var rows = tbody.getElementsByTagName("tr");

var searchInput = document.getElementById("searchInput");

function filterTable() {
    var searchTerm = searchInput.value.toLowerCase();
    for (var i = 0; i < rows.length; i++) {
        var rowText = rows[i].textContent.toLowerCase();
        rows[i].style.display = rowText.includes(searchTerm) ? "" : "none";
    }
}

searchInput.addEventListener("input", function () {
    filterTable();
});
