const Swal = require('sweetalert2');
const modeloShowMesas = require('../models/showTablesModel');
const modeloUpdateMesaController = require('../models/updateTableModel');

function obtenerMesaIdDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function mostrarImagen(imagenUrl) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = imagenUrl;
    imagePreview.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const mesaId = obtenerMesaIdDeURL();

    if (mesaId) {
        try {
            const mesa = await modeloShowMesas.obtenerMesaPorID(mesaId);

            if (mesa) {
                document.getElementById('mesaId').value = mesa.idMesas;
                document.getElementById('numeroMesa').value = mesa.numeroMesa;
                document.getElementById('estadoMesa').value = mesa.estado;
                document.getElementById('capacidadMesa').value = mesa.capacidad;
                document.getElementById('descripcionMesa').value = mesa.descripcion;

                if (mesa.imgMesaUrl) {
                    mostrarImagen(mesa.imgMesaUrl);
                }
            } else {
                console.error('No se encontró una mesa con ese ID.');
            }
        } catch (error) {
            console.error('Error al cargar los datos de la mesa: ', error);
        }
    } else {
        console.error('No se proporcionó un ID de mesa en la URL.');
    }
});

async function actualizarMesa() {
    const mesaId = document.getElementById('mesaId').value;
    const numeroMesa = document.getElementById('numeroMesa').value;
    const estadoMesa = document.getElementById('estadoMesa').value;
    const capacidadMesa = document.getElementById('capacidadMesa').value;
    const descripcionMesa = document.getElementById('descripcionMesa').value;

    if (!mesaId || !numeroMesa || !estadoMesa || !capacidadMesa) {
        Swal.fire('Campos vacíos', 'Por favor, completa todos los campos obligatorios.', 'warning');
        return false;
    }

    const confirmacion = await Swal.fire({
        title: '¿Deseas actualizar la mesa?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    });

    if (confirmacion.isConfirmed) {
        const archivo = document.getElementById('fileInput').files[0];
        let imgMesaUrl = '';

        if (archivo) {
            try {
                const rutaImagenAnterior = await modeloUpdateMesaController.obtenerRutaImagenAnterior(mesaId);

                if (rutaImagenAnterior) {
                    await modeloUpdateMesaController.eliminarImagenAnterior(rutaImagenAnterior);
                }

                imgMesaUrl = await modeloUpdateMesaController.guardarImagen(archivo, rutaImagenAnterior);
            } catch (error) {
                console.error('Error al guardar la imagen: ' + error);
            }
        } else {
            imgMesaUrl = await modeloUpdateMesaController.obtenerRutaImagenAnterior(mesaId);
        }

        const actualizacionExitosa = await modeloUpdateMesaController.actualizarMesa(mesaId, numeroMesa, estadoMesa, capacidadMesa, descripcionMesa, imgMesaUrl);

        if (actualizacionExitosa) {
            Swal.fire({
                title: 'Mesa actualizada',
                text: 'La mesa se ha actualizado con éxito.',
                icon: 'success',
            });
        }
    }
}

function clearForm() {
    document.getElementById('mesaId').value = '';
    document.getElementById('numeroMesa').value = '';
    document.getElementById('estadoMesa').value = '';
    document.getElementById('capacidadMesa').value = '';
    document.getElementById('descripcionMesa').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function chooseFile() {
    document.getElementById('fileInput').click();
}

function previewImage() {
    const archivo = document.getElementById('fileInput').files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (archivo) {
        const reader = new FileReader();
        reader.onload = function () {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(archivo);
    }
}

function changeImage() {
    document.getElementById('fileInput').click();
}

// Exporta las funciones
module.exports = {
    actualizarMesa,
    clearForm,
    chooseFile,
    previewImage,
    changeImage,
};
