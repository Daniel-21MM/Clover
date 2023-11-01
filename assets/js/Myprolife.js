// LOAD IMAGE-PROLIFE 

// Obtén una referencia al input de tipo file y la imagen
const fileInput = document.getElementById("imageInput");
const avatarImage = document.getElementById("imagenMostrada");

// Agrega un evento clic a la imagen que activará el input de archivo
avatarImage.addEventListener("click", () => {
	fileInput.click();
});

// Agrega un evento change al input de archivo para manejar la selección del archivo
fileInput.addEventListener("change", (event) => {
	// Aquí puedes manejar el archivo seleccionado, por ejemplo, mostrar una vista previa
	const selectedFile = event.target.files[0];
	if (selectedFile) {
		const reader = new FileReader();
		reader.onload = (e) => {
			// Muestra la imagen seleccionada en la vista previa
			avatarImage.src = e.target.result;
		};
		reader.readAsDataURL(selectedFile);
	}
});

// Guardar img
document.addEventListener('DOMContentLoaded', () => {
    const imagenMostrada = document.getElementById('imagenMostrada');
    const imageNav = document.getElementById('imagen-nav');
    const otrasImagenes = document.querySelectorAll('.otra-imagen'); // selecciona todas las etiquetas con la clase 'otra-imagen'
    const imageInput = document.getElementById('imageInput');
    
    // Obtener la imagen desde Local Storage si existe
    const rutaImagen = localStorage.getItem('rutaImagen');

    if (rutaImagen) {
        imagenMostrada.src = rutaImagen;
        imageNav.src = rutaImagen;

        // Establecer la misma imagen en otras etiquetas img
        otrasImagenes.forEach((imagen) => {
            imagen.src = rutaImagen;
        });
    } else {
        imagenMostrada.src = '../assets/imgUsers/imgPerfil.jpg';
        imageNav.src = '../assets/imgUsers/imgPerfil.jpg';

        // Establecer la misma imagen en otras etiquetas img
        otrasImagenes.forEach((imagen) => {
            imagen.src = '../assets/imgUsers/imgPerfil.jpg';
        });
    }

    // Agregar un evento para cambiar la imagen cuando el usuario selecciona un archivo
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                const rutaImagenTemporal = reader.result;
                localStorage.setItem('rutaImagen', rutaImagenTemporal);
                imagenMostrada.src = rutaImagenTemporal;
                imageNav.src = rutaImagenTemporal;

                // Establecer la misma imagen en otras etiquetas img
                otrasImagenes.forEach((imagen) => {
                    imagen.src = rutaImagenTemporal;
                });
            }
            reader.readAsDataURL(file);
        }
    });
});

