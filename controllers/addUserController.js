const db = require('../database/db');
const Swal = require('sweetalert2');

// Función para insertar un nuevo usuario en la base de datos
async function insertarUsuario(nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha) {
    return new Promise(async (resolve, reject) => {
        // Validación para campos vacíos
        if (!nombre || !telefono || !usuario || !contrasena || !correo || !direccion || !fecha) {
            Swal.fire('Campos vacíos', 'Por favor, completa todos los campos obligatorios.', 'warning');
            reject(false);
            return;
        }

        // Mostrar un SweetAlert de confirmación antes de registrar
        const confirmacion = await Swal.fire({
            title: '¿Deseas registrar al usuario?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });

        if (confirmacion.isConfirmed) {
            const sql = 'INSERT INTO usuarios (nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, fecha];

            db.connection.query(sql, values, (queryErr, results) => {
                if (queryErr) {
                    console.error('Error al insertar el usuario: ' + queryErr.message);
                    reject(false);
                } else {
                    if (results.affectedRows === 1) {
                        // Mostrar SweetAlert de éxito
                        Swal.fire('Usuario creado', 'El usuario se ha registrado con éxito', 'success');
                        resolve(true);
                    } else {
                        // Mostrar SweetAlert de error
                        Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
                        reject(false);
                    }
                }
            });
        } else {
            // Mostrar SweetAlert de acción cancelada
            Swal.fire('Acción cancelada', 'No se ha registrado al usuario', 'info');
            reject(false);
        }
    });
}

module.exports = {
    insertarUsuario,
};
