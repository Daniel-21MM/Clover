// Controlador (updateImageController.js)
const fs = require('fs');
const guardarImagenModel = require('../models/updateImageModel');

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const subirImagenButton = document.getElementById('subirImagenButton');
    const imagenMostrada = document.getElementById('imagenMostrada'); // Agrega el ID 'imagenMostrada' a la etiqueta <img>

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
                                
                                // Muestra la imagen en la etiqueta <img>
                                const imagenBase64 = 'data:image/jpeg;base64,' + data.toString('base64');
                                imagenMostrada.src = imagenBase64;

                                // Muestra un mensaje de éxito
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
            console.log('No se ha seleccionado ninguna imagen.');
        }
    });
});
