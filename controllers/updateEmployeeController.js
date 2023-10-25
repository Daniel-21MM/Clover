const db = require('../database/db');
const Swal = require('sweetalert2');

async function actualizarUsuario(user_id, nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion) {
    return new Promise(async (resolve, reject) => {
        // Validación para campos vacíos
        if (!user_id || !nombre || !telefono || !usuario || !contrasena || !correo || !direccion) {
            Swal.fire('Campos vacíos', 'Por favor, completa todos los campos obligatorios.', 'warning');
            reject(false);
            return;
        }

        // Mostrar un SweetAlert de confirmación antes de actualizar
        const confirmacion = await Swal.fire({
            title: '¿Deseas actualizar al usuario?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });

        if (confirmacion.isConfirmed) {
            const sql = 'UPDATE usuarios SET nombre=?, telefono=?, usuario=?, contrasena=?, correo=?, rol=?, imgPerfilUrl=?, direccion=? WHERE id=?';
            const values = [nombre, telefono, usuario, contrasena, correo, rol, imgPerfilUrl, direccion, user_id];

            db.connection.query(sql, values, (queryErr, results) => {
                if (queryErr) {
                    console.error('Error al actualizar el usuario: ' + queryErr.message);
                    reject(false);
                } else {
                    if (results.affectedRows === 1) {
                        // Mostrar SweetAlert de éxito
                        Swal.fire('Usuario actualizado', 'El usuario se ha actualizado con éxito', 'success');
                        resolve(true);
                    } else {
                        // Mostrar SweetAlert de error
                        Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
                        reject(false);
                    }
                }
            });
        } else {
            // Mostrar SweetAlert de acción cancelada
            Swal.fire('Acción cancelada', 'No se ha actualizado al usuario', 'info');
            reject(false);
        }
    });
}

module.exports = {
    actualizarUsuario,
};
