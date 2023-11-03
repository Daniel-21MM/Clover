const fs = require('fs');
const path = require('path');
const Swal = require('sweetalert2');
const mesasModel = require('../models/addTableModel');

async function registrarMesa() {
    const archivo = document.getElementById('fileInput').files[0];
    const numeroMesa = document.getElementById('numeroMesa').value;
    const estado = document.getElementById('estado').value;
    const descripcion = document.getElementById('descripcion').value;
    const capacidad = parseInt(document.getElementById('capacidad').value);
    const fecha_creacion = document.getElementById('fecha_creacion').value;

    // Verifica que los campos requeridos no estén vacíos
    if (!numeroMesa || !fecha_creacion || !estado || !capacidad || !descripcion) {
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
            text: 'Por favor, seleccione una imagen de la mesa.',
        });
        return;
    }

    // Mostrar un SweetAlert de confirmación antes de registrar
    const confirmacion = await Swal.fire({
        title: '¿Deseas registrar la mesa?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    });

    if (!confirmacion.isConfirmed) {
        return;
    }

    let imgMesaUrl = '';
    if (archivo) {
        try {
            // Obtener el número actual de imágenes en la carpeta
            const numeroDeImagenes = obtenerNumeroDeImagenes();
            imgMesaUrl = await guardarImagen(archivo, numeroDeImagenes);
        } catch (error) {
            console.error('Error al guardar la imagen: ' + error);
        }
    }

    mesasModel.insertarMesa(numeroMesa, estado, descripcion, capacidad, fecha_creacion, imgMesaUrl)
        .then((registroExitoso) => {
            if (registroExitoso) {
                Swal.fire({
                    title: 'Mesa registrada',
                    text: 'La mesa se ha registrado con éxito.',
                    icon: 'success',
                });
            }
        });
}

function clearForm() {
    document.getElementById('numeroMesa').value = '';
    document.getElementById('estado').value = 'Disponible'; // Valor predeterminado
    document.getElementById('descripcion').value = '';
    document.getElementById('capacidad').value = '';
    document.getElementById('fecha_creacion').value = '';

    document.getElementById('imagePreview').style.display = 'none';
}

function obtenerNumeroDeImagenes() {
    const rutaCarpeta = path.join(__dirname, '../assets/imgTables/');
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
        const rutaCarpeta = path.join(__dirname, '../assets/imgTables/');
        const nombreArchivo = `imgMesa${numeroDeImagenes + 1}.jpg`; // Nombre con contador
        const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

        fs.copyFile(archivo.path, rutaCompleta, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('../assets/imgTables/' + nombreArchivo);
            }
        });
    });
}

module.exports = {
    registrarMesa,
    clearForm
};
