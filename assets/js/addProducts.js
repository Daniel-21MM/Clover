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

function chooseFile() {
  document.getElementById("fileInput").click();
}

function previewImage() {
  const fileInput = document.getElementById("fileInput");
  const imagePreview = document.getElementById("imagePreview");
  const fileIcon = document.getElementById("fileIcon");

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
      fileIcon.style.display = "none"; // Ocultar el icono
    };

    reader.readAsDataURL(fileInput.files[0]);
  }
}

function changeImage() {
  document.getElementById("fileInput").value = ""; // Reiniciar el valor del input de archivo
  document.getElementById("imagePreview").style.display = "none"; // Ocultar la imagen previsualizada
  document.getElementById("fileIcon").style.display = "block"; // Mostrar el icono
}

function clearForm() {
  // Obtener todos los elementos de entrada del formulario
  const formElements = document.querySelectorAll("#contact-form input, #contact-form select");

  // Limpiar el valor de cada elemento de entrada
  formElements.forEach((element) => {
    element.value = "";
  });

  // Reiniciar la imagen previsualizada
  changeImage();
}
