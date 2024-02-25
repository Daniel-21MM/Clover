document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('spinner-overlay').style.display = 'flex';
});

// Oculta el spinner después de unos segundos, simulando una carga de 5 segundos
window.addEventListener('load', function () {
    setTimeout(function () {
        document.getElementById('spinner-overlay').style.display = 'none';
    }, 850);
});