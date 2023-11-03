const Swal = require('sweetalert2');
const modeloShowArticulos = require('../models/showProductsModels');
const modeloUpdateArticuloController = require('../models/updateProductsModel');

function obtenerArticuloIdDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function mostrarImagen(imagenUrl) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = imagenUrl;
    imagePreview.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const articulo_id = obtenerArticuloIdDeURL();

    if (articulo_id) {
        try {
            const articulo = await modeloShowArticulos.obtenerPlatilloPorID(articulo_id);

            if (articulo) {
                document.getElementById('id').value = articulo.id;
                document.getElementById('nombrePlatillo').value = articulo.nombrePlatillo;
                document.getElementById('categoria').value = articulo.categoria;
                document.getElementById('descripcionPlatillo').value = articulo.descripcionPlatillo;
                document.getElementById('precio').value = articulo.precio;

                if (articulo.imagenUrlPlatillo) {
                    mostrarImagen(articulo.imagenUrlPlatillo);
                }
            } else {
                console.error('No se encontró un artículo con ese ID.');
            }
        } catch (error) {
            console.error('Error al cargar los datos del artículo: ', error);
        }
    } else {
        console.error('No se proporcionó un ID de artículo en la URL.');
    }
});

async function actualizarArticulo() {
    const id = document.getElementById('id').value;
    const nombrePlatillo = document.getElementById('nombrePlatillo').value;
    const categoria = document.getElementById('categoria').value;
    const descripcionPlatillo = document.getElementById('descripcionPlatillo').value;
    const precio = document.getElementById('precio').value;

    if (!id || !nombrePlatillo || !categoria || !descripcionPlatillo || !precio) {
        Swal.fire('Campos vacíos', 'Por favor, completa todos los campos obligatorios.', 'warning');
        return false;
    }

    const confirmacion = await Swal.fire({
        title: '¿Deseas actualizar el artículo?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    });

    if (confirmacion.isConfirmed) {
        const archivo = document.getElementById('fileInput').files[0];
        let imagenUrlPlatillo = '';

        if (archivo) {
            try {
                const rutaImagenAnterior = await modeloUpdateArticuloController.obtenerRutaImagenAnterior(id);

                if (rutaImagenAnterior) {
                    await modeloUpdateArticuloController.eliminarImagenAnterior(rutaImagenAnterior);
                }

                imagenUrlPlatillo = await modeloUpdateArticuloController.guardarImagen(archivo, rutaImagenAnterior);
            } catch (error) {
                console.error('Error al guardar la imagen: ' + error);
            }
        } else {
            imagenUrlPlatillo = await modeloUpdateArticuloController.obtenerRutaImagenAnterior(id);
        }

        const actualizacionExitosa = await modeloUpdateArticuloController.actualizarArticulo(id, nombrePlatillo, categoria, descripcionPlatillo, precio, imagenUrlPlatillo);

        if (actualizacionExitosa) {
            Swal.fire({
                title: 'Artículo actualizado',
                text: 'El artículo se ha actualizado con éxito.',
                icon: 'success',
            });
        }
    }
}

function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('nombrePlatillo').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('descripcionPlatillo').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function chooseFile() {
    document.getElementById('fileInput').click();
}

function previewImage() {
    const archivo = document.getElementById('fileInput').files[0];
    const imagePreview = document.getElementById('imagePreview');
    const fileIcon = document.getElementById('fileIcon');

    if (archivo) {
        const reader = new FileReader();
        reader.onload = function() {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(archivo);
    }
}

function changeImage() {
    document.getElementById('fileInput').click();
}

// Exporta las funciones
module.exports = {
    actualizarArticulo,
    clearForm,
    chooseFile,
    previewImage,
    changeImage,
};
