const db = require('../database/db');

async function insertarUsuario(nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha) {
    // Validación para campos vacíos
    if (!nombre || !telefono || !usuario || !contrasena || !correo || !direccion || !fecha) {
        return Promise.reject(false); // Rechazamos la promesa si hay campos vacíos
    }

    if (true) { // Puedes reemplazar true con tu lógica de confirmación
        console.log('Usuario confirmó la acción');
        
        const sql = 'INSERT INTO usuarios (nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha];

        return new Promise((resolve, reject) => {
            db.connection.query(sql, values, (queryErr, results) => {
                if (queryErr) {
                    console.error('Error al insertar el usuario: ' + queryErr.message);
                    reject(false);
                } else {
                    if (results.affectedRows === 1) {
                        console.log('Usuario creado con éxito');
                        resolve(true);
                    } else {
                        console.error('No se pudo registrar el usuario');
                        reject(false);
                    }
                }
            });
        });
    } else {
        console.log('Usuario canceló la acción');
        return Promise.reject(false); // Si no se confirma, rechazamos la promesa
    }
}

// Resto del código...

module.exports = {
    insertarUsuario,
   
};
