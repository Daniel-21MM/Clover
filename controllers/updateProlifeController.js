const db = require('../database/db');
const Swal = require('sweetalert2');

function obtenerDatosUsuario(usuarioId) {
    return new Promise((resolve, reject) => {
        const consultaUsuarioSQL = 'SELECT nombre, telefono, usuario, contrasena, correo FROM usuarios WHERE id = ?';

        db.connection.query(consultaUsuarioSQL, [usuarioId], (err, rows) => {
            if (err) {
                console.error('Error al obtener datos del usuario: ' + err.message);
                reject(err);
                return;
            }

            if (rows.length === 0) {
                console.error('Usuario no encontrado');
                reject(new Error('Usuario no encontrado'));
            } else {
                const datosUsuario = {
                    nombre: rows[0].nombre,
                    telefono: rows[0].telefono,
                    usuario: rows[0].usuario,
                    contrasena: rows[0].contrasena,
                    correo: rows[0].correo
                };
                resolve(datosUsuario);
            }
        });
    });
}

async function actualizarUsuario(usuarioId, nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo) {
    return new Promise(async (resolve, reject) => {
        try {
            const datosUsuario = await obtenerDatosUsuario(usuarioId);

            const sql = 'UPDATE usuarios SET nombre=?, telefono=?, usuario=?, contrasena=?, correo=? WHERE id=?';
            const values = [nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo, usuarioId];

            db.connection.query(sql, values, (queryErr, results) => {
                if (queryErr) {
                    console.error('Error al actualizar el perfil: ' + queryErr.message);
                    reject(false);
                } else {
                    if (results.affectedRows === 1) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Actualización exitosa',
                            text: 'Los datos se han actualizado con éxito.',
                        });
                        guardarDatosUsuarioEnLocalStorage(nuevoNombre, nuevoCorreo);
                        resolve(true);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en la actualización',
                            text: 'No se pudo actualizar el perfil.',
                        });
                        reject(false);
                    }
                }
            });
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.message);
            reject(false);
        }
    });
}

function guardarDatosUsuarioEnLocalStorage(nombre, correo) {
    localStorage.setItem('user_name', nombre);
    localStorage.setItem('user_email', correo);
}

module.exports = {
    obtenerDatosUsuario,
    actualizarUsuario,
    guardarDatosUsuarioEnLocalStorage,
};
