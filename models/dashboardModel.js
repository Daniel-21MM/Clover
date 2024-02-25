const { obtenerNumeroRegistros, obtenerVentasPorDia, obtenerGananciasPorDia, obtenerVentasPorDosDias } = require('../controllers/dashboardController');
const db = require('../database/db');
const formatoFecha = (fecha) => fecha.toISOString().split('T')[0]; // Asegúrate de que esta función esté definida

document.addEventListener('DOMContentLoaded', async function () {
  const numeroUsuariosElement = document.getElementById('numeroUsuarios');
  const numeroArticulosElement = document.getElementById('numeroArticulos');
  const ventasPorDiaContainer = document.getElementById('ventasPorDia');
  const pieChartContainer = document.getElementById('pieChart');



  // Cargar dinámicamente el número de usuarios
  const totalUsuarios = await obtenerNumeroRegistros('usuarios', 'rol != 1');
  numeroUsuariosElement.textContent = totalUsuarios;

  // Cargar dinámicamente el número de artículos
  const totalArticulos = await obtenerNumeroRegistros('platillos');
  numeroArticulosElement.textContent = totalArticulos;

  // Cargar dinámicamente el número de ventas por día
  const ventasPorDia = await obtenerVentasPorDia();
  mostrarVentasPorDia(ventasPorDia, 'ventasPorDia');

  // Obtener el número de ventas por día anterior
  const ventasPorDosDias = await obtenerVentasPorDosDias();
  const totalVentasDosDias = ventasPorDosDias.length > 0 ? ventasPorDosDias[0].totalVentas : 0;

  // Cargar dinámicamente el número de ganancias por día
  const gananciasPorDia = await obtenerGananciasPorDia();
  mostrarGananciasPorDia(gananciasPorDia, 'gananciasPorDia');

  // Obtener las fechas y ventas para usar en la gráfica
const fechas = ventasPorDia.map(venta => formatoFecha(new Date(venta.fecha))); // Asegúrate de que formatoFecha acepte un objeto Date
const ventasDiaActual = ventasPorDia.reduce((total, venta) => total + venta.totalVentas, 0);

// console.log('Fechas:', fechas);
// console.log('Total Ventas Día Actual:', ventasDiaActual);
// console.log('Total Ventas Día Anterior:', totalVentasDosDias);

const chartOptions = {
  series: [
    {
      name: 'Ventas Día Anterior',
      data: [1, totalVentasDosDias], 
    },
    {
      name: 'Ventas Día Actual',
      data: [0, ventasDiaActual], 
    },
  ],
  chart: {
    type: 'line',
    height: 350,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    categories: ['Ayer', 'Hoy'],
    labels: {
      formatter: function(val) {
        return val === 0 ? 'Ayer' : 'Hoy'; 
      }
    }
  },
  yaxis: {
    title: { 
      text: 'Ventas',
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val;
      },
    },
  },
};

const chartVentas = new ApexCharts(document.getElementById('ventasChart'), chartOptions);
chartVentas.render();






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


function mostrarGananciasPorDia(gananciasPorDia, containerId) {
  const container = document.getElementById(containerId);

  // Limpiar el contenido antes de agregar nuevos elementos
  container.innerHTML = '';

  // Calcular el total de ganancias por día
  const totalGananciasPorDia = gananciasPorDia.reduce((total, ganancia) => total + ganancia.totalGanancias, 0);

  // Modificar la línea para evitar el cero al principio usando parseInt
  document.getElementById('gananciasPorDia').innerHTML = `<h2>$${parseInt(totalGananciasPorDia)}</h2>`;
}


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

function mostrarVentasPorDia(ventasPorDia, containerId) {
  const container = document.getElementById(containerId);

  // Limpiar el contenido antes de agregar nuevos elementos
  container.innerHTML = '';

  // Calcular el total de ventas por día
  const totalVentasPorDia = ventasPorDia.reduce((total, venta) => total + venta.totalVentas, 0);

  // Agregar el número total de ventas al elemento con el id 'ventasPorDia'
  document.getElementById('ventasPorDia').textContent = totalVentasPorDia;
}



