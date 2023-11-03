const fs = require('fs');
const path = require('path');
const Swal = require('sweetalert2');
const platillosModel = require('../models/addProductsModel');

async function registrarPlatillo() {
    const archivo = document.getElementById('fileInput').files[0];
    const nombrePlatillo = document.getElementById('nombrePlatillo').value;
    const categoria = document.getElementById('categoria').value;
    const descripcionPlatillo = document.getElementById('descripcionPlatillo').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const fecha_creacion = document.getElementById('fecha_creacion').value;

    // Verifica que los campos requeridos no estén vacíos
    if (!nombrePlatillo || !precio || !fecha_creacion || !descripcionPlatillo) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, complete todos los campos requeridos.',
        });
        return;
    }

    // Verifica si se ha seleccionado un archivo de imagen
    if (!archivo) {
        Swal.fire({
            icon: 'warning',
            title: '¡Imagen no seleccionada!',
            text: 'Por favor, seleccione una imagen del articulo.',
        });
        return;
    }

    // Mostrar un SweetAlert de confirmación antes de registrar
    const confirmacion = await Swal.fire({
        title: '¿Deseas registrar el articulo?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    });

    if (!confirmacion.isConfirmed) {
        return;
    }

    let imagenUrlPlatillo = '';
    if (archivo) {
        try {
            // Obtener el número actual de imágenes en la carpeta
            const numeroDeImagenes = obtenerNumeroDeImagenes();
            imagenUrlPlatillo = await guardarImagen(archivo, numeroDeImagenes);
        } catch (error) {
            console.error('Error al guardar la imagen: ' + error);
        }
    }

    platillosModel.insertarPlatillo(nombrePlatillo, categoria, descripcionPlatillo, precio, fecha_creacion, imagenUrlPlatillo)
        .then((registroExitoso) => {
            if (registroExitoso) {
                Swal.fire({
                    title: 'Platillo registrado',
                    text: 'El platillo se ha registrado con éxito.',
                    icon: 'success',
                });
            }
        });
}

function clearForm() {
    document.getElementById('nombrePlatillo').value = '';
    document.getElementById('categoria').value = 'Bebidas'; // Valor predeterminado
    document.getElementById('descripcionPlatillo').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('fecha_creacion').value = '';

    document.getElementById('imagePreview').style.display = 'none';
}

function obtenerNumeroDeImagenes() {
    const rutaCarpeta = path.join(__dirname, '../assets/imgProducts/');
    // Leemos la lista de archivos en la carpeta
    const archivos = fs.readdirSync(rutaCarpeta);

    // Filtrar solo archivos de imagen, si es necesario
    const imagenes = archivos.filter((archivo) =>
        archivo.toLowerCase().endsWith('.jpg') ||
        archivo.toLowerCase().endsWith('.jpeg') ||
        archivo.toLowerCase().endsWith('.png')
    );

    return imagenes.length;
}

function guardarImagen(archivo, numeroDeImagenes) {
    return new Promise((resolve, reject) => {
        const rutaCarpeta = path.join(__dirname, '../assets/imgProducts/');
        const nombreArchivo = `imgPlatillo${numeroDeImagenes + 1}.jpg`; // Nombre con contador
        const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

        fs.copyFile(archivo.path, rutaCompleta, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('../assets/imgProducts/' + nombreArchivo);
            }
        });
    });
}

module.exports = {
    registrarPlatillo,
    clearForm
};
