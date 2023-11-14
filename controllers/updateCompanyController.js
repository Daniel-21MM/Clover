const Swal = require('sweetalert2');
const updateEmpresaModel = require('../models/updateCompanyModel');

function obtenerIdDeEmpresa() {
    // Asumiendo que la empresa siempre tiene el ID 1
    return 1;
}

async function mostrarImagen(imagenUrl) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = imagenUrl;
    imagePreview.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const idEmpresa = obtenerIdDeEmpresa();

    try {
        const datosEmpresa = await updateEmpresaModel.obtenerDatosEmpresa(idEmpresa);

        if (datosEmpresa) {
            document.getElementById('id').value = datosEmpresa.id;
            document.getElementById('nombreEmpresa').value = datosEmpresa.nombreEmpresa;
            document.getElementById('direccion').value = datosEmpresa.direccionEmpresa;
            document.getElementById('numeroTelefono').value = datosEmpresa.telefonoEmpresa;
            document.getElementById('correoElectronico').value = datosEmpresa.emailEmpresa;
            document.getElementById('detallesEmpresa').value = datosEmpresa.detallesEmpresa;

            if (datosEmpresa.imgUrl) {
                mostrarImagen(datosEmpresa.imgUrl);
            }
        } else {
            console.error('No se encontraron datos de la empresa con ese ID.');
        }
    } catch (error) {
        console.error('Error al cargar los datos de la empresa: ', error);
    }
});

async function actualizarDatosEmpresa() {
    const id = document.getElementById('id').value;
    const nombreEmpresa = document.getElementById('nombreEmpresa').value;
    const direccionEmpresa = document.getElementById('direccion').value;
    const telefonoEmpresa = document.getElementById('numeroTelefono').value;
    const emailEmpresa = document.getElementById('correoElectronico').value;
    const detallesEmpresa = document.getElementById('detallesEmpresa').value;

    // Verificar que nombreEmpresa no sea nulo o vacío
    if (!id || !nombreEmpresa || !direccionEmpresa || !telefonoEmpresa || !emailEmpresa || !detallesEmpresa) {
        Swal.fire('Campos vacíos', 'Por favor, completa todos los campos obligatorios.', 'warning');
        return false;
    }

    const confirmacion = await Swal.fire({
        title: '¿Deseas actualizar los datos de la empresa?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    });

    if (confirmacion.isConfirmed) {
        const archivo = document.getElementById('logoEmpresa').files[0];
        let imgUrl = '';

        if (archivo) {
            try {
                const rutaImagenAnterior = await updateEmpresaModel.obtenerRutaImagenAnterior(id);

                if (rutaImagenAnterior) {
                    await updateEmpresaModel.eliminarImagenAnterior(rutaImagenAnterior);
                }

                imgUrl = await updateEmpresaModel.guardarImagen(archivo, rutaImagenAnterior);
            } catch (error) {
                console.error('Error al guardar la imagen: ' + error);
            }
        } else {
            imgUrl = await updateEmpresaModel.obtenerRutaImagenAnterior(id);
        }

        const actualizacionExitosa = await updateEmpresaModel.actualizarDatosEmpresa(id, nombreEmpresa, direccionEmpresa, telefonoEmpresa, emailEmpresa, detallesEmpresa, imgUrl);

        if (actualizacionExitosa) {
            Swal.fire({
                title: 'Datos de la empresa actualizados',
                text: 'Los datos de la empresa se han actualizado con éxito.',
                icon: 'success',
            });
        }
    }
}

function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('nombreEmpresa').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('numeroTelefono').value = '';
    document.getElementById('correoElectronico').value = '';
    document.getElementById('detallesEmpresa').value = '';
    document.getElementById('logoEmpresa').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function chooseFile() {
    document.getElementById('logoEmpresa').click();
}

function previewImage() {
    const archivo = document.getElementById('logoEmpresa').files[0];
    const imagePreview = document.getElementById('imagePreview');
    const fileIcon = document.getElementById('fileIcon');

    if (archivo) {
        const reader = new FileReader();
        reader.onload = function() {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(archivo);
    }
}

function changeImage() {
    document.getElementById('logoEmpresa').click();
}

// Exporta las funciones
module.exports = {
    actualizarDatosEmpresa,
    clearForm,
    chooseFile,
    previewImage,
    changeImage,
};
