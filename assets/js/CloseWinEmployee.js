
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const btnSalirEmpleado = document.getElementById('btnSalirEmpleado');

    btnSalirEmpleado.addEventListener('click', () => {
        ipcRenderer.send('btnSalirEmpleadoClick');
    });
});
