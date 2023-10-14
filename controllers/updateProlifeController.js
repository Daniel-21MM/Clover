const db = require('../database/db');

function actualizarUsuario(usuarioId, nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE usuarios SET nombre=?, telefono=?, usuario=?, contrasena=?, correo=? WHERE id=?';
        const values = [nuevoNombre, nuevoTelefono, nuevoUsuario, nuevaContrasena, nuevoCorreo, usuarioId];

        db.connection.query(sql, values, (queryErr, results) => {
            if (queryErr) {
                console.error('Error al actualizar el perfil: ' + queryErr.message);
                reject(queryErr);
            } else {
                if (results.affectedRows === 1) {
                    // Actualización exitosa
                    console.log('Actualización exitosa: Los datos se han actualizado con éxito.');
                    resolve(true);
                } else {
                    reject(new Error('No se pudo actualizar el perfil'));
                }
            }
        });
    });
}

module.exports = {
    actualizarUsuario,
};
