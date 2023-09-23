const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database/db');
const LoginControler = require('./controllers/LoginController');

// Aquí creamos las variables para nuestras ventanas
let ventanaPrincipal;
let ventanaInicio;
let ventanaEmpleados;

// Creamos la función createWindow() para crear nuestra ventana y sus propiedades y manejo de mensajes
function crearVentanaPrincipal() {
  ventanaPrincipal = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Cargar el archivo login.html desde la carpeta views
  ventanaPrincipal.loadFile(path.join(__dirname, 'views', 'login.html'));

  ipcMain.on('getUsuarios', async (event) => {
    try {
      const usuarios = await LoginControler.loginUsuario();
      event.reply('usuariosData', { results: usuarios });
    } catch (error) {
      event.reply('usuariosData', { error: error.message });
    }
  });

  ventanaPrincipal.on('closed', () => {
    ventanaPrincipal = null;
  });

  // Aquí llamamos el evento de cerrar la ventana principal
  ipcMain.on('cerrarVentanaActual', () => {
    if (ventanaPrincipal) {
      ventanaPrincipal.close();
    }
  });
}

// Función para crear la ventana de inicio (ya no toma un usuario como parámetro)
function crearVentanaInicio() {
  ventanaInicio = new BrowserWindow({
    width: 1800,
    height: 1000,
    autoHideMenuBar: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  ventanaInicio.loadFile(path.join(__dirname, 'views', 'panelAdmin.html'));
}

// Función para crear la ventana de empleados
function crearVentanaEmpleados() {
  ventanaEmpleados = new BrowserWindow({
    width: 1800,
    height: 1000,
    autoHideMenuBar: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  ventanaEmpleados.loadFile(path.join(__dirname, 'views', 'panelEmployees.html'));
}

// Agregar un manejador para el evento 'abrirVentanaInicio'
ipcMain.on('abrirVentanaInicio', (event, usuario) => {
  crearVentanaInicio(usuario);
});

// Agregar un manejador para el evento 'abrirVentanaEmpleados'
ipcMain.on('abrirVentanaEmpleados', () => {
  crearVentanaEmpleados();
});

// Estas funciones son por defecto, no modificar ni borrar nada de aquí
app.on('ready', crearVentanaPrincipal);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (ventanaPrincipal === null) {
    crearVentanaPrincipal();
  }
});
