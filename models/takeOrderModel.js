const Swal = require('sweetalert2');

document.addEventListener('DOMContentLoaded', async function () {
    const platilloSelect = document.getElementById('platillo');
    const detallesPedidoTextArea = document.getElementById('detallesPedido');
    const cantidadInput = document.getElementById('cantidad');
    const descuentoInput = document.getElementById('descuento');
    const nombreClienteInput = document.getElementById('nombreCliente');
    const fechaCreacionInput = document.getElementById('fechaCreacion');

    // Código para cargar dinámicamente las opciones del select
    const opciones = await obtenerOpcionesPlatillos();

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = `${opcion.nombrePlatillo} - $${opcion.precio}`;
        option.textContent = `${opcion.nombrePlatillo} - $${opcion.precio}`;
        platilloSelect.appendChild(option);
    });

    document.getElementById('agregarOrden').addEventListener('click', function () {
        // Verificar si todos los campos requeridos están llenos
        if (!nombreClienteInput.checkValidity() || !cantidadInput.checkValidity() || !fechaCreacionInput.checkValidity()) {
            // Mostrar un SweetAlert si algún campo requerido está vacío
            Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
            return;
        }

        const platilloSeleccionado = platilloSelect.value;
        const cantidad = cantidadInput.value;
        let descuento = descuentoInput.value;

       

        // Mostrar SweetAlert si el descuento no es válido
        if (descuento < 0 || descuento > 100) {
            Swal.fire('Error', 'Ingrese un descuento válido (entre 0 y 100).', 'error');
            return;
        }

        // Parsea el precio y realiza el cálculo
        const precio = parseFloat(platilloSeleccionado.match(/\$([\d.]+)/)[1]);
        let total = precio * cantidad;

        // Aplicar descuento si se proporciona
        if (descuento) {
            const descuentoFloat = parseFloat(descuento);
            if (!isNaN(descuentoFloat) && descuentoFloat > 0) {
                total = total - (total * (descuentoFloat / 100));
            }
        }

        const detalle = `${platilloSeleccionado} x ${cantidad} = $${total.toFixed(2)}`;

        if (detallesPedidoTextArea.value) {
            detallesPedidoTextArea.value += '\n';
        }

        detallesPedidoTextArea.value += detalle;
    });

    detallesPedidoTextArea.addEventListener('click', function () {
        const detalles = detallesPedidoTextArea.value.split('\n');
        detallesPedidoTextArea.value = '';

        for (let i = 0; i < detalles.length; i++) {
            detallesPedidoTextArea.value += detalles[i];
            if (i < detalles.length - 1) {
                detallesPedidoTextArea.value += '\n';
            }
        }
    });
});

