const { obtenerMesas, obtenerOpcionesPlatillos, actualizarEstadoMesa, guardarPedido } = require('../controllers/tablesController');
const Swal = require('sweetalert2');

document.addEventListener('DOMContentLoaded', async function () {
    const contenedorMesas = document.getElementById('contenedor-mesas');

    // Cargar dinámicamente las tarjetas de mesas
    const mesas = await obtenerMesas();

    mesas.forEach(mesa => {
        const mesaCard = document.createElement('div');
        mesaCard.className = `content content-1 ${mesa.estado.replace(/\s+/g, '-')}`;
        mesaCard.innerHTML = `
            <h2>Mesa ${mesa.numeroMesa}</h2>
            <p>Estado: ${mesa.estado}</p>
            <p>Capacidad: ${mesa.capacidad}</p>
            <img src="${mesa.imgMesaUrl}" alt="Imagen de la mesa">
            <button class="atender-btn" data-mesa="${mesa.numeroMesa}">Atender</button>
        `;
        contenedorMesas.appendChild(mesaCard);
    });

    // Agregar evento al botón "Atender"
    const botonesAtender = document.querySelectorAll('.atender-btn');
    botonesAtender.forEach(boton => {
        boton.addEventListener('click', function (event) {
            const numeroMesa = event.currentTarget.getAttribute('data-mesa');
            window.location.href = `takeorder.html?mesa=${numeroMesa}`;
        });
    });

    // Código para cargar dinámicamente las opciones del select
    const platilloSelect = document.getElementById('platillo');
    const detallesPedidoTextArea = document.getElementById('detallesPedido');
    const cantidadInput = document.getElementById('cantidad');
    const descuentoInput = document.getElementById('descuento');
    const nombreClienteInput = document.getElementById('nombreCliente');
    const fechaCreacionInput = document.getElementById('fechaCreacion');

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
            Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'warning');
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

        const precio = parseFloat(platilloSeleccionado.match(/\$([\d.]+)/)[1]);
        let total = precio * cantidad;

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

    document.getElementById('EnviarOrden').addEventListener('click', async function () {
        // Verificar si todos los campos requeridos están llenos
        if (!nombreClienteInput.checkValidity() || !fechaCreacionInput.checkValidity()) {
            // Mostrar un SweetAlert si algún campo requerido está vacío
            Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'warning');
            return;
        }

        if (detallesPedidoTextArea.value.trim() === '') {
            Swal.fire('Error', 'Por favor, ingrese los detalles del pedido.', 'warning');
            return;
        }

        const nombreCliente = nombreClienteInput.value;
        const detallesPedido = detallesPedidoTextArea.value;
        const descuento = descuentoInput.value ? parseFloat(descuentoInput.value) : 0;
        const fechaHora = fechaCreacionInput.value;

        const confirmacion = await Swal.fire({
            title: '¿Está seguro de confirmar el pedido?',
            text: 'Una vez confirmado, no podrá realizar cambios.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#049935',
            cancelButtonColor: '#FC3B56',
            confirmButtonText: 'Confirmar'
        });

        if (confirmacion.isConfirmed) {
            Swal.fire({
                title: 'Éxito',
                text: 'Pedido guardado correctamente.',
                icon: 'success',
            }).then(() => {
                const numeroMesa = obtenerNumeroMesaDeURL();

                const selector = `.mesa-${numeroMesa}`;
                const mesaCard = document.querySelector(selector);

                console.log('Mesa Card:', mesaCard);

                if (mesaCard) {
                    mesaCard.classList.remove('disponible');
                    mesaCard.classList.add('ocupada');
                } else {
                    console.error('No se pudo encontrar el elemento de la mesa.');
                }

                actualizarEstadoMesa(numeroMesa, 'No Disponible')
                    .then(() => {
                        guardarPedido(nombreCliente, detallesPedido, descuento, fechaHora)
                            .then(() => {
                                console.log('Pedido guardado en la base de datos.');
                                window.location.href = 'panelEmployee.html';
                            })
                            .catch((error) => {
                                console.error('Error al guardar el pedido en la base de datos: ' + error);
                            });
                    });
            });
        }
    });

    function obtenerNumeroMesaDeURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('mesa'), 10) || 0;
    }
});
