const fs = require('fs');
const path = require('path');
const guardarImagenModel = require('../controllers/updateImageController');

document.addEventListener('DOMContentLoaded', async () => {
    const imageInput = document.getElementById('imageInput');
    const subirImagenButton = document.getElementById('subirImagenButton');
    const imagenMostrada = document.getElementById('imagenMostrada');
    
    subirImagenButton.addEventListener('click', async () => {
        // Pregunta al usuario si está seguro de actualizar la foto
        const confirmacion = await Swal.fire({
            icon: 'question',
            title: '¿Está seguro de actualizar su foto de perfil?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });
        
        if (confirmacion.isConfirmed) {
            // El usuario confirmó la actualización
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
                                const userIdInput = document.getElementById('id'); // Obtener el elemento del input oculto
                                const usuario_id = userIdInput.value; // Obtener el usuario_id

                                try {
                                    const resultado = await guardarImagenModel.guardarImagen(data, usuario_id); // Pasar usuario_id
                                    console.log('Imagen guardada en la base de datos con ID:', resultado);

                                    const rutaCarpeta = path.join(__dirname, '../assets/imgUsers/');
                                    imagenMostrada.src = `${rutaCarpeta}${resultado}.jpg`;
                                    
                                    // Muestra un mensaje de éxito
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Foto de perfil actualizada',
                                        text: 'Tu foto de perfil ha sido actualizada exitosamente.',
                                    }).then(() => {
                                        // Recargar la página actual
                                        location.reload();
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
                Swal.fire({
                    icon: 'error',
                    title: 'No se ha seleccionado una imagen',
                    text: 'Por favor, selecciona una imagen para subir.',
                });
            }
        }
    });
});
