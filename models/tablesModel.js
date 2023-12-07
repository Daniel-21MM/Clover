document.addEventListener('DOMContentLoaded', async function () {
    const Swal = require('sweetalert2');
    const { obtenerMesas, obtenerOpcionesPlatillos, guardarPedido, actualizarEstadoMesa, guardarVentaEnTablaVentas, actualizarEstadoPedido, obtenerEstadoPedido, obtenerUltimoPedidoEnProceso, obtenerDatosEmpresa } = require('../controllers/tablesController');
    const pdfMake = require('pdfmake/build/pdfmake');
    const pdfFonts = require('pdfmake/build/vfs_fonts');
    const path = require('path')
    pdfMake.vfs = pdfFonts.pdfMake.vfs;


    const formularioHTML = `
    <form id="tomar-Orden" class="d-flex flex-wrap formulario-grande">
    <div class="form-group flex-grow-1">
        <label for="nombreCliente" class="form-label">Nombre del cliente*</label>
        <input id="nombreCliente" type="text" name="nombreCliente" class="form-control">
    </div>

    <div class="form-group flex-grow-1">
        <label for="platillos" class="form-label">Platillo*</label>
        <select id="platillos" name="platillo" class="form-select" required>
            <!-- Opciones de platillos aquí -->
        </select>
    </div>

    <div class="form-group flex-grow-1">
        <label for="cantidad" class="form-label cantidad">Cantidad*</label>
        <input id="cantidad" type="number" step="1" name="cantidad" class="form-control">
    </div>

    <div class="form-group flex-grow-1">
        <label for="descuento" class="form-label">Agregar descuento % (opcional)</label>
        <input id="descuento" type="number" name="descuento" min="0" max="100" class="form-control">
    </div>

    <div class="form-group flex-grow-1">
        <label for="fechaHora" class="form-label">Fecha*</label>
        <input id="fechaHora" type="datetime-local" name="fechaHora" class="form-control">

    </div>

    <div id="detallesPedido" class="form-group flex-grow-1 detalles-pedido-container"></div>

    <div class="modal-footer">
        <button type="button" class="btn btn-success" id="agregarOrden">Agregar orden</button>
        <button type="button" class="btn btn-success" id="EnviarOrden">Enviar orden</button>
    </div>
</form>
    `;

    async function main() {
        const contenedorMesas = document.getElementById('contenedor-mesas');

        if (contenedorMesas) {
            cargarMesas();
        }

        async function cargarMesas() {
            try {
                const mesas = await obtenerMesas();

                mesas.forEach(mesa => {
                    const mesaCard = crearMesaCard(mesa);
                    contenedorMesas.appendChild(mesaCard);
                });
            } catch (error) {
                console.error('Error al cargar las mesas:', error);
            }
        }
        // Agregar la siguiente función después de la función cargarMesas
        async function handleEditarPedidoButtonClick(mesa) {
            try {
                // Obtener el último pedido en proceso asociado a la mesa
                const pedidoEnProceso = await obtenerUltimoPedidoEnProceso(mesa.numeroMesa);

                // Verificar si hay un pedido en proceso antes de editar
                if (pedidoEnProceso) {
                    // Crear un objeto con la información del pedido para prellenar el formulario
                    const pedidoInfo = {
                        nombreCliente: pedidoEnProceso.nombreCliente,
                        detallesPedido: JSON.parse(pedidoEnProceso.DetallesPedidos),
                        descuento: pedidoEnProceso.Descuento,
                        fechaHora: pedidoEnProceso.fechaHora,
                    };

                    // Mostrar el modal con el formulario prellenado
                    mostrarModal(`Editando Pedido de la Mesa ${mesa.numeroMesa}`, formularioHTML, pedidoInfo);
                } else {
                    // Si no hay pedido en proceso, mostrar un mensaje informativo
                    Swal.fire({
                        icon: 'info',
                        title: 'No hay pedido en proceso',
                        text: 'No hay ningún pedido en proceso para la mesa seleccionada.',
                    });
                }
            } catch (error) {
                console.error('Error al editar el pedido:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al editar el pedido',
                    text: 'Hubo un error al intentar editar el pedido. Por favor, inténtalo de nuevo.',
                });
            }
        }


        function crearMesaCard(mesa) {
            const mesaCard = document.createElement('div');
            mesaCard.className = `content content-1 ${mesa.estado.replace(/\s+/g, '-')}`;
            mesaCard.innerHTML = `
                <h2>Mesa ${mesa.numeroMesa}</h2>
                <p>Estado: ${mesa.estado}</p>
                <p>Capacidad: ${mesa.capacidad}</p>
                <img src="${mesa.imgMesaUrl}" alt="Imagen de la mesa">
            `;

            const actionButtonContainer = document.createElement('div');
            actionButtonContainer.classList.add('action-buttons');

            if (mesa.estado === 'Disponible') {
                const atenderButton = crearBoton('Atender', 'btnatender', () => handleAtenderButtonClick(mesa));
                actionButtonContainer.appendChild(atenderButton);
            } else {
                const editarPedidoButton = crearBoton('Editar Pedido', 'btneditar', () => handleEditarPedidoButtonClick(mesa)); // Modificado
                const finalizarButton = crearBoton('Finalizar', 'btnatender', () => handleFinalizarButtonClick(mesa));

                actionButtonContainer.appendChild(editarPedidoButton);
                actionButtonContainer.appendChild(finalizarButton);
            }

            mesaCard.appendChild(actionButtonContainer);
            return mesaCard;
        }

        function crearBoton(texto, clase, onClick) {
            const button = document.createElement('button');
            button.textContent = texto;
            button.classList.add(clase);
            button.addEventListener('click', onClick);
            return button;
        }

        function handleAtenderButtonClick(mesa) {
            const numeroMesa = mesa.numeroMesa;
            const modalHeaderContent = `Atendiendo Orden de la Mesa ${numeroMesa}`;


            mostrarModal(modalHeaderContent, formularioHTML);
        }

        // Dentro de la función mostrarModal
        function mostrarModal(headerContenido, bodyContenido, pedidoInfo = null) { // Modificado
            const modalHeader = document.querySelector('.modal-title');
            const modalBody = document.querySelector('.modal-body');

            modalHeader.textContent = headerContenido;
            modalBody.innerHTML = bodyContenido;

            // Preencher el formulario con la información del pedido si está disponible
            if (pedidoInfo) {
                prellenarFormulario(pedidoInfo);
            }

            const formulario = document.getElementById('tomar-Orden');
            formulario.classList.add('formulario-grande');

            const existingModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
            if (existingModal) {
                existingModal.dispose();
            }

            const myModal = new bootstrap.Modal(document.getElementById('myModal'), {
                backdrop: 'static',
                keyboard: false
            });

            function onModalShown() {
                cargarOpcionesPlatillos();
                agregarEventosFormulario();
            }

            myModal._element.removeEventListener('shown.bs.modal', onModalShown);

            myModal.show();

            myModal._element.addEventListener('shown.bs.modal', () => {
                cargarOpcionesPlatillos();
                agregarEventosFormulario();
            });
        }

        // Función para prellenar el formulario con la información del pedido
        function prellenarFormulario(pedidoInfo) {
            // Preencher los campos del formulario con la información del pedido
            document.getElementById('nombreCliente').value = pedidoInfo.nombreCliente;
            // Verificar si detallesPedido está definido en pedidoInfo
            if (pedidoInfo.detallesPedido) {
                // Preencher los detalles del pedido
                pedidoInfo.detallesPedido.forEach(detalle => {
                    const detallePedido = {
                        platillo: detalle.Platillo,
                        cantidad: parseInt(detalle.Cantidad, 10),
                        total: detalle.Total.replace('$', ''),
                    };

                    agregarDetallesPedido(detallePedido);
                });
            }

            // Preencher otros campos del formulario (descuento, fechaHora, etc.)
            document.getElementById('descuento').value = pedidoInfo.descuento;

            // Formatear la fecha en el formato adecuado para el input datetime-local
            const fechaFormateada = formatearFechaParaInput(pedidoInfo.fechaHora);

            // Imprimir la fecha formateada en la consola para depuración
            console.log('FechaHora formateada:', fechaFormateada);

            document.getElementById('fechaHora').value = fechaFormateada;
        }

        // Función para formatear la fecha en el formato correcto para datetime-local
        function formatearFechaParaInput(fecha) {
            // Formato esperado por datetime-local: "YYYY-MM-DDTHH:mm"
            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            const hora = String(fecha.getHours()).padStart(2, '0');
            const minutos = String(fecha.getMinutes()).padStart(2, '0');

            return `${año}-${mes}-${dia}T${hora}:${minutos}`;
        }

        function cargarOpcionesPlatillos() {
            const platillosSelect = document.getElementById('platillos');

            if (platillosSelect) {
                obtenerOpcionesPlatillos().then(opciones => {
                    platillosSelect.innerHTML = "";

                    opciones.forEach(opcion => {
                        const option = document.createElement('option');
                        option.value = opcion.nombrePlatillo;
                        option.textContent = `${opcion.nombrePlatillo} - $${opcion.precio}`;
                        platillosSelect.appendChild(option);
                    });
                }).catch(error => {
                    console.error('Error al cargar las opciones de platillos:', error);
                });
            } else {
                console.error('No se encontró el elemento con ID "platillos" en el DOM.');
            }
        }

        function agregarEventosFormulario() {
            const agregarOrdenButton = document.getElementById('agregarOrden');
            const enviarOrdenButton = document.getElementById('EnviarOrden'); // Nuevo

            if (agregarOrdenButton && enviarOrdenButton) {
                agregarOrdenButton.addEventListener('click', handleAgregarOrdenButtonClick);
                enviarOrdenButton.addEventListener('click', handleEnviarOrdenButtonClick); // Nuevo
            }
        }

        async function handleAgregarOrdenButtonClick() {
            // Obtener los valores del formulario
            const nombreCliente = document.getElementById('nombreCliente').value;
            const platilloSelect = document.getElementById('platillos');
            const platilloSeleccionado = platilloSelect.value;
            const cantidad = document.getElementById('cantidad').value;
            let descuento = document.getElementById('descuento').value;

            // Validar campos obligatorios
            if (!nombreCliente || !platilloSeleccionado || !cantidad) {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Campos incompletos!',
                    text: 'Por favor, completa todos los campos obligatorios',
                });
                return;
            }

            // Obtener el precio del platillo seleccionado desde el select
            const precioPlatillo = obtenerPrecioPlatillo(platilloSelect);

            // Si el campo de descuento está vacío, asignarle un valor predeterminado de 0
            descuento = descuento || 0;

            // Calcular el total (precio x cantidad) considerando el descuento
            const total = calcularTotal(precioPlatillo, cantidad, descuento);

            // Crear un objeto con los detalles del pedido
            const detallePedido = {
                platillo: platilloSeleccionado,
                cantidad: cantidad,
                total: total,
            };

            // Llamar a la función para agregar los detalles al arreglo
            agregarDetallesPedido(detallePedido);
        }

        function calcularTotal(precio, cantidad, descuento) {
            // Calcular el total considerando el descuento
            const subtotal = precio * cantidad;
            const descuentoPorcentaje = parseFloat(descuento) || 0;
            const descuentoMonto = (subtotal * descuentoPorcentaje) / 100;
            const total = subtotal - descuentoMonto;

            return total.toFixed(2);
        }

        function agregarDetallesPedido(detallePedido) {
            const detallesPedidoDiv = document.getElementById('detallesPedido');

            if (detallesPedidoDiv) {
                // Crear un elemento div para los detalles y añadirlo al div
                const detallesDiv = document.createElement('div');
                detallesDiv.classList.add('detalle-pedido');

                // Crear un span para mostrar el detalle formateado y añadirlo al div
                const span = document.createElement('span');

                const platilloSpan = document.createElement('span');
                platilloSpan.innerHTML = `Platillo: ${detallePedido.platillo}`;
                detallesDiv.appendChild(platilloSpan);

                const cantidadSpan = document.createElement('span');
                cantidadSpan.innerHTML = ` Cantidad: ${detallePedido.cantidad}`;
                detallesDiv.appendChild(cantidadSpan);

                const totalSpan = document.createElement('span');
                totalSpan.innerHTML = ` Total: $${detallePedido.total}`;
                detallesDiv.appendChild(totalSpan);

                // Crear un botón para eliminar el detalle
                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'X';
                botonEliminar.classList.add('btn-eliminar');
                botonEliminar.addEventListener('click', () => eliminarDetalle(detallesDiv));

                detallesDiv.appendChild(botonEliminar);

                detallesPedidoDiv.appendChild(detallesDiv);
            } else {
                console.error('No se encontró el elemento con ID "detallesPedido" en el DOM.');
            }
        }

        function eliminarDetalle(detalleDiv) {
            const detallesPedidoDiv = document.getElementById('detallesPedido');
            if (detallesPedidoDiv) {
                detallesPedidoDiv.removeChild(detalleDiv);
            }
        }


        function obtenerPrecioPlatillo(platilloSelect) {
            // Obtener el índice seleccionado
            const indiceSeleccionado = platilloSelect.selectedIndex;

            // Obtener el precio de la opción seleccionada
            const precioPlatillo = platilloSelect.options[indiceSeleccionado].textContent.split(' - ')[1].replace('$', '');

            return parseFloat(precioPlatillo);
        }
        async function handleEnviarOrdenButtonClick() {
            try {
                // Obtener los valores del formulario
                const modalTitle = document.querySelector('.modal-title');
                const numeroMesa = obtenerNumeroMesaDesdeEncabezado(modalTitle.textContent);
                const nombreCliente = document.getElementById('nombreCliente').value;

                // Obtener el arreglo de detalles del pedido
                const detallesPedidoArray = obtenerDetallesPedidoArray();

                // Obtener descuento, fechaHora, u otros valores del formulario según sea necesario
                const descuento = document.getElementById('descuento').value;
                const fechaHora = document.getElementById('fechaHora').value;

                // Validar campos obligatorios
                if (!nombreCliente || detallesPedidoArray.length === 0 || !fechaHora) {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Campos incompletos!',
                        text: 'Por favor completa todos los campos obligatorios.',
                    });
                    return;
                }

                // Verificar si el descuento es una cadena no vacía y es un número
                const descuentoValue = (descuento !== '' && !isNaN(descuento)) ? descuento : '0';

                // Mostrar SweetAlert para confirmar el envío del pedido
                const confirmacion = await Swal.fire({
                    title: '¿Está seguro de enviar el pedido?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, enviar pedido',
                    cancelButtonText: 'Cancelar',
                });

                if (confirmacion.isConfirmed) {
                    // Resto del código para enviar el pedido a la base de datos
                    await guardarPedido(numeroMesa, nombreCliente, detallesPedidoArray, descuentoValue, fechaHora);

                    // Actualizar el estado de la mesa a "Ocupada"
                    await actualizarEstadoMesa(numeroMesa, 'No Disponible');

                    // Cerrar el modal
                    const myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
                    if (myModal) {
                        myModal.hide();
                    }

                    // Mostrar un mensaje de éxito con botón "Ok"
                    await Swal.fire({
                        title: 'Éxito',
                        text: 'Pedido enviado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    });

                    // Recargar la página después de hacer clic en el botón "Ok"
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error al enviar el pedido:', error);
                Swal.fire('Error', 'Ocurrió un error al enviar el pedido', 'error');
            }
        }



        function obtenerDetallesPedidoArray() {
            const detallesPedidoDiv = document.getElementById('detallesPedido');
            const detallesDivs = detallesPedidoDiv.getElementsByClassName('detalle-pedido');

            // Convertir los elementos div en un arreglo de objetos
            const detallesArray = Array.from(detallesDivs).map(detalleDiv => {
                const detalle = {};
                detalleDiv.childNodes.forEach(span => {
                    const [propiedad, valor] = span.innerHTML.split(': ').map(str => str.trim());
                    detalle[propiedad] = valor;
                });
                return detalle;
            });

            return detallesArray;
        }

        async function handleFinalizarButtonClick(mesa) {
            try {
                // Obtener el último pedido en proceso asociado a la mesa
                const pedidoEnProceso = await obtenerUltimoPedidoEnProceso(mesa.numeroMesa);

                // Verificar si hay un pedido en proceso antes de finalizar
                if (pedidoEnProceso) {
                    // Mostrar SweetAlert para confirmar el envío del pedido
                    const confirmacion = await Swal.fire({
                        title: '¿Está seguro de finalizar el pedido?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, finalizar pedido',
                        cancelButtonText: 'Cancelar',
                    });

                    if (confirmacion.isConfirmed) {
                        // Después de finalizar el pedido, generar el informe
                        const filePath = await generarInforme(mesa.numeroMesa);

                        // Actualizar el estado del pedido a "Finalizado"
                        await actualizarEstadoPedido(mesa.numeroMesa, 'Finalizado');

                        // Actualizar el estado de la mesa a "Disponible"
                        await actualizarEstadoMesa(mesa.numeroMesa, 'Disponible');

                        // Mostrar un mensaje de éxito con un botón "Ok"
                        await Swal.fire({
                            icon: 'success',
                            title: 'Pedido finalizado y ticket generado correctamente',
                            confirmButtonText: 'Ok',
                        });

                        // Recargar la página después de hacer clic en el botón "Ok"
                        window.location.reload();
                    }
                } else {
                    // Si no hay pedido en proceso, mostrar un mensaje informativo
                    Swal.fire({
                        icon: 'info',
                        title: 'No hay pedido en proceso',
                        text: 'No hay ningún pedido en proceso para la mesa seleccionada.',
                    });
                }
            } catch (error) {
                console.error('Error al finalizar el pedido:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al finalizar el pedido',
                    text: 'Hubo un error al intentar finalizar el pedido. Por favor, inténtalo de nuevo.',
                });
            }
        }


        // Función asincrónica para generar el informe en formato PDF
        async function generarInforme(numeroMesa) {
            try {
                // Obtener el último pedido asociado a la mesa
                const ultimoPedido = await obtenerUltimoPedidoEnProceso(numeroMesa);

                console.log('Datos del pedido obtenido:', ultimoPedido);

                // Verificar si hay un pedido en proceso antes de finalizar
                if (!ultimoPedido) {
                    console.error('No se encontró un pedido en proceso válido para la mesa:', numeroMesa);
                    return null;
                }

                // Obtener los detalles del pedido
                const detallesPedidos = JSON.parse(ultimoPedido.DetallesPedidos);

                // Obtener los datos de la empresa desde la base de datos
                const datosEmpresa = await obtenerDatosEmpresa();

                if (!datosEmpresa) {
                    console.error('No se pudieron obtener los datos de la empresa.');
                    return null;
                  }
              
                  const { nombreEmpresa, direccionEmpresa, telefonoEmpresa } = datosEmpresa;

                const fechaActual = new Date();
                const textoFechaActual = `Fecha: ${fechaActual.toLocaleString()}`;
                const totalVenta = detallesPedidos.reduce((total, detalle) => {
                    return total + parseFloat(detalle.Total.replace('$', ''));
                }, 0);

                // Crear un objeto para la inserción en la tabla "ventas"
                const ventaData = {
                    DetallesPedidos: ultimoPedido.DetallesPedidos,
                    estado: 'Finalizado',
                    fechaHora: new Date(),
                    idPedido: ultimoPedido.idPedido,
                    nombreCliente: ultimoPedido.nombreCliente,
                    numeroMesa: numeroMesa,
                    totalGanancia: totalVenta.toFixed(2),
                };


                guardarVentaEnTablaVentas(ventaData)

                console.log('Datos de la venta guardados en la tabla "ventas".');

                const contenidoInforme = {
                    pageSize: {
                        width: 250,
                        height: 450,
                    },
                    content: [
                        {
                            stack: [
                                {
                                    text: nombreEmpresa,
                                    fontSize: 14,
                                    bold: true,
                                    alignment: 'center',
                                    margin: [0, 0, 0, 10],
                                },
                                {
                                    text: `Factura de venta - Mesa ${numeroMesa}`,
                                    fontSize: 9,
                                    alignment: 'center',
                                    margin: [0, 0, 0, 10],
                                },
                            ],
                        },
                        {
                            text: 'Detalles de la venta',
                            fontSize: 9,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 0, 0, 10],
                        },
                        {
                            table: {
                                widths: ['*', 'auto'],
                                body: [
                                    [
                                        { text: 'Artículo', bold: true, fontSize: 9, margin: [0, 10, 0, 2] },
                                        { text: 'Precio', bold: true, fontSize: 9, margin: [0, 10, 0, 2] },
                                    ],
                                    ...detallesPedidos.map(detalle => {
                                        return [
                                            { text: `${detalle.Platillo} x${detalle.Cantidad}`, fontSize: 8, margin: [0, 2, 0, 2] },
                                            { text: `${detalle.Total}`, fontSize: 8, margin: [0, 2, 0, 2] },
                                        ];
                                    }),
                                ],
                            },
                            layout: {
                                hLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.body.length ? 1 : 0;
                                },
                                vLineWidth: function (i) {
                                    return 0;
                                },
                                hLineColor: function (i) {
                                    return i === 0 ? '#000' : '#ddd';
                                },
                                paddingLeft: function (i) {
                                    return i === 0 ? 0 : 8;
                                },
                                paddingRight: function (i, node) {
                                    return i === node.table.widths.length - 1 ? 0 : 8;
                                },
                            },
                            margin: [0, 0, 0, 10],
                        },
                        {
                            text: `Total: $${totalVenta.toFixed(2)}`,
                            bold: true,
                            fontSize: 10,
                            alignment: 'right',
                            margin: [0, 0, 0, 15],
                        },
                        {
                            text: `¡Gracias por su preferencia ${ultimoPedido.nombreCliente}!`,
                            fontSize: 9,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 0, 0, 5],
                        },
                        {
                            text: textoFechaActual,
                            fontSize: 8,
                            alignment: 'center',
                            margin: [0, 0, 0, 10],
                        },
                        {
                            text: direccionEmpresa,
                            fontSize: 7,
                            alignment: 'center',
                            margin: [0, 0, 0, 5],
                        },
                        {
                            text: [
                              { text: 'Tel: ', fontSize: 7 },
                              { text: telefonoEmpresa, fontSize: 7 },
                            ],
                            alignment: 'center',
                            margin: [0, 0, 0, 5],
                          },
                    ],
                };

                return new Promise((resolve, reject) => {
                    const pdfDoc = pdfMake.createPdf(contenidoInforme);

                    const fileName = `Reporte${numeroMesa}_${new Date().toISOString()}.pdf`;

                    pdfDoc.download(fileName, () => {
                        const filePath = path.join(__dirname, fileName);
                        console.log('Informe generado y guardado con éxito:', filePath);
                        resolve(filePath);
                    }, (error) => {
                        console.error('Error al generar el informe:', error);
                        reject(error);
                    });
                });
            } catch (error) {
                console.error('Error al obtener detalles del pedido:', error);
                throw error;
            }
        }

        function obtenerNumeroMesaDesdeEncabezado(encabezado) {
            const match = encabezado.match(/\d+/);
            return match ? parseInt(match[0], 10) : null;
        }
    }

    main();
});
