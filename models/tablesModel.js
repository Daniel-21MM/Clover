
const { obtenerMesas } = require('../controllers/tablesController'); // Reemplaza 'tu_controlador' con la ruta correcta

document.addEventListener('DOMContentLoaded', async function () {
    const contenedorMesas = document.getElementById('contenedor-mesas'); // El div donde se cargarán las tarjetas de mesas

    // Código para cargar dinámicamente las tarjetas de mesas
    const mesas = await obtenerMesas();

    mesas.forEach(mesa => {
        const mesaCard = document.createElement('div');
        mesaCard.className = 'content content-1'; // Agrega las clases correspondientes
        mesaCard.innerHTML = `
          <div class="fab fa-twitter"></div>
          <h2>Mesa ${mesa.numeroMesa}</h2>
          <p>Estado: ${mesa.estado}</p>
        
          <p>Capacidad: ${mesa.capacidad}</p>
         
          <img src="${mesa.imgMesaUrl}" alt="Imagen de la mesa">
          <a href="takeorder.html" class="atender-btn">Atender</a>
        `;
        contenedorMesas.appendChild(mesaCard);
    });        
});
