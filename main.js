const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database/db');
const LoginControler = require('./controllers/LoginController');

let ventanaPrincipal;
let ventanaInicio;
let ventanaEmpleados;

function crearVentanaPrincipal() {
  ventanaPrincipal = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar:false,
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
}

function crearVentanaInicio() {
  ventanaInicio = new BrowserWindow({
    width: 1500,
    height: 800,
    autoHideMenuBar:false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  ventanaInicio.loadFile(path.join(__dirname, 'views', 'AdminPanel.html'));

  ventanaInicio.on('closed', () => {
    ventanaInicio = null;
  });
}

function crearVentanaEmpleados() {
  ventanaEmpleados = new BrowserWindow({
    width: 2000,
    height: 1200,
    autoHideMenuBar:false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  ventanaEmpleados.loadFile(path.join(__dirname, 'views', 'panelEmployee.html'));

  ventanaEmpleados.on('closed', () => {
    ventanaEmpleados = null;
  });
}

// Agrega un manejador para el evento 'abrirVentanaInicio'
ipcMain.on('abrirVentanaInicio', (event, usuario) => {
  crearVentanaInicio(usuario);
});

// Agrega un manejador para el evento 'abrirVentanaEmpleados'
ipcMain.on('abrirVentanaEmpleados', () => {
  crearVentanaEmpleados();
});

// Manejar el clic en el enlace Salir desde el proceso principal
ipcMain.on('btnSalirClick', () => {
  if (ventanaInicio) {
    // Cierra la ventana actual (AdminPanel.html)
    ventanaInicio.close();
    ventanaInicio = null;
    // Abre la ventana de inicio (login.html)
    crearVentanaPrincipal();
  }
});


// Manejar el clic en el enlace Salir desde el proceso principal
ipcMain.on('cerrarVentanaActualLogin', () => {
  if (ventanaPrincipal) {
    // Cierra la ventana actual (login.html)
    ventanaPrincipal.close();
    ventanaPrincipal = null;
  }
});

// Mantener este código al final de tu archivo main.js
ipcMain.on('btnSalirEmpleadoClick', () => {
  if (ventanaEmpleados) {
    // Cierra la ventana actual (panelEmployee.html)
    ventanaEmpleados.close();
    ventanaEmpleados = null;
    // Abre la ventana de inicio de sesión (login.html)
    crearVentanaPrincipal();
  }
});

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
