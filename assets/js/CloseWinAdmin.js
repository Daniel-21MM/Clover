const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const btnSalir = document.getElementById('btnSalir');

    btnSalir.addEventListener('click', () => {
        // Enviamos un mensaje al proceso principal para manejar el clic en el enlace Salir
        ipcRenderer.send('btnSalirClick');
    });
});
