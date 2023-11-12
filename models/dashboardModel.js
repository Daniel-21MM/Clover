const { obtenerNumeroRegistros } = require('../controllers/dashboardController'); // Reemplaza 'tu_modelo' con la ruta correcta
const db = require('../database/db');
document.addEventListener('DOMContentLoaded', async function () {
  const numeroUsuariosElement = document.getElementById('numeroUsuarios'); // El elemento donde mostrarás el número de usuarios
  const numeroArticulosElement = document.getElementById('numeroArticulos'); // El elemento donde mostrarás el número de artículos
  const pieChartContainer = document.getElementById('pieChart'); // Contenedor de la gráfica de pastel

  // Cargar dinámicamente el número de usuarios
  const totalUsuarios = await obtenerNumeroRegistros('usuarios', 'rol != 1');
  numeroUsuariosElement.textContent = totalUsuarios;

  // Cargar dinámicamente el número de artículos
  const totalArticulos = await obtenerNumeroRegistros('platillos');
  numeroArticulosElement.textContent = totalArticulos;

  // Obtener dinámicamente los datos para la gráfica de pastel
  const datosArticulos = await obtenerDatosArticulos();

  // Crear la gráfica de pastel
  const optionsArticulos = {
    series: datosArticulos.series,
    chart: {
      height: 350,
      type: 'pie',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        }
      }
    },
    labels: datosArticulos.labels,
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'bottom'
    }
  };

  const chartArticulos = new ApexCharts(pieChartContainer, optionsArticulos);
  chartArticulos.render();
});

async function obtenerDatosArticulos() {
  const sql = 'SELECT categoria, COUNT(*) as cantidad FROM platillos GROUP BY categoria';

  return new Promise((resolve, reject) => {
    db.connection.query(sql, (queryErr, results) => {
      if (queryErr) {
        console.error('Error al obtener datos para la gráfica de pastel: ' + queryErr.message);
        reject({ series: [0], labels: ['Error'] });
      } else {
        const series = results.map(item => item.cantidad);
        const labels = results.map(item => item.categoria);
        resolve({ series, labels });
      }
    });
  });
}
