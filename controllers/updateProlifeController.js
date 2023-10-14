const db = require('../database/db');
const Swal = require('sweetalert2');

function actualizarUsuario(usuarioId, nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo) {
    return new Promise((resolve, reject) => {
        // Primero, verifica si el usuario con el ID proporcionado existe
        const consultaUsuarioSQL = 'SELECT * FROM usuarios WHERE id = ?';
        db.connection.query(consultaUsuarioSQL, [usuarioId], (err, rows) => {
            if (err) {
                console.error('Error al consultar el usuario: ' + err.message);
                reject(err);
                return;
            }

            if (rows.length === 0) {
                // El usuario con el ID proporcionado no existe
                console.error('Usuario no encontrado');
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario no encontrado',
                    text: 'El usuario con el ID proporcionado no existe.',
                });
                reject(new Error('Usuario no encontrado'));
            } else {
                // El usuario existe, procede con la actualización
                const sql = 'UPDATE usuarios SET nombre=?, telefono=?, usuario=?, contrasena=?, correo=? WHERE id=?';
                const values = [nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo, usuarioId];

                db.connection.query(sql, values, (queryErr, results) => {
                    if (queryErr) {
                        console.error('Error al actualizar el perfil: ' + queryErr.message);
                        reject(queryErr);
                    } else {
                        if (results.affectedRows === 1) {
                            // Actualización exitosa
                            Swal.fire({
                                icon: 'success',
                                title: 'Actualización exitosa',
                                text: 'Los datos se han actualizado con éxito.',
                            });
                            resolve(true);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error en la actualización',
                                text: 'No se pudo actualizar el perfil.',
                            });
                            reject(new Error('No se pudo actualizar el perfil'));
                        }
                    }
                });
            }
        });
    });
}

module.exports = {
    actualizarUsuario,
};
