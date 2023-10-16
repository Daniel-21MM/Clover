const fs = require('fs');
const guardarImagenModel = require('../models/updateImageModel');


document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const subirImagenButton = document.getElementById('subirImagenButton');

    subirImagenButton.addEventListener('click', async () => {
        const file = imageInput.files[0];

        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                const maxSizeBytes = 5 * 1024 * 1024; // 5MB

                if (file.size <= maxSizeBytes) {
                    fs.readFile(file.path, async (err, data) => {
                        if (err) {
                            console.error(err);
                            // Maneja el error
                        } else {
                            try {
                                const resultado = await guardarImagenModel.guardarImagen(data);
                                console.log('Imagen guardada en la base de datos con ID:', resultado);

                                // Muestra un mensaje de éxito
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Foto de perfil actualizada',
                                    text: 'Tu foto de perfil ha sido actualizada exitosamente.',
                                });
                            } catch (error) {
                                console.error('Error al guardar la imagen:', error);
                                // Maneja el error
                            }
                        }
                    });
                } else {
                    console.log('El tamaño del archivo supera el límite máximo de 5 MB.');
                }
            } else {
                console.log('Formato de archivo no válido. Se admiten solo archivos JPEG y PNG.');
            }
        } else {
            // Muestra una notificación SweetAlert cuando no se selecciona una imagen
            Swal.fire({
                icon: 'error',
                title: 'No se ha seleccionado una imagen',
                text: 'Por favor, selecciona una imagen para subir.',
            });
        }
    });
});
