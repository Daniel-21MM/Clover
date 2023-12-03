document.addEventListener('DOMContentLoaded', async function () {
    const Swal = require('sweetalert2');
    const { obtenerMesas, obtenerOpcionesPlatillos, guardarPedido, actualizarEstadoMesa, obtenerDetallesPedido } = require('../controllers/tablesController');
    const pdfMake = require('pdfmake/build/pdfmake');
    const pdfFonts = require('pdfmake/build/vfs_fonts');
    const path = require('path')
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
                const editarPedidoButton = crearBoton('Editar Pedido', 'btnatender', () => handleActionButtonClick(mesa));
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
            const formularioHTML = `
            <form id="tomar-Orden" class="d-flex flex-wrap">
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
                <label for="cantidad" class="form-label">Cantidad*</label>
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

            mostrarModal(modalHeaderContent, formularioHTML);
        }

        function mostrarModal(headerContenido, bodyContenido) {
            const modalHeader = document.querySelector('.modal-title');
            const modalBody = document.querySelector('.modal-body');

            modalHeader.textContent = headerContenido;
            modalBody.innerHTML = bodyContenido;

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
            const descuento = document.getElementById('descuento').value;
            const fechaHora = document.getElementById('fechaHora').value;
        
            // Obtener el precio del platillo seleccionado desde el select
            const precioPlatillo = obtenerPrecioPlatillo(platilloSelect);
        
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
        
                detallesPedidoDiv.appendChild(detallesDiv);
            } else {
                console.error('No se encontró el elemento con ID "detallesPedido" en el DOM.');
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
        
                // Mostrar SweetAlert para confirmar el envío del pedido
                const confirmacion = await Swal.fire({
                    title: '¿Está seguro de enviar el pedido?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, enviar pedido',
                    cancelButtonText: 'Cancelar',
                });
        
                if (confirmacion.isConfirmed) {
                    // Guardar el pedido en la base de datos
                    await guardarPedido(numeroMesa, nombreCliente, detallesPedidoArray, descuento, fechaHora);
        
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
            const confirmacion = await Swal.fire({
                icon: 'question',
                title: '¿Estás seguro de finalizar el pedido?',
                showCancelButton: true,
                confirmButtonText: 'Sí, finalizar',
                cancelButtonText: 'Cancelar',
            });
        
            if (!confirmacion.isConfirmed) {
                return;
            }
        
            try {
                // Después de finalizar el pedido, generar el informe
                const filePath = await generarInforme(mesa);
        
                // Mostrar un mensaje de éxito con un botón "Ok"
                await Swal.fire({
                    icon: 'success',
                    title: 'Pedido finalizado y ticket generado correctamente',
                    confirmButtonText: 'Ok',
                });
        
                // Actualizar el estado de la mesa a "Disponible"
                await actualizarEstadoMesa(mesa.numeroMesa, 'Disponible');
        
                // Recargar la página después de hacer clic en el botón "Ok"
                window.location.reload();
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
       async function generarInforme(mesa) {
    try {
        // Consultar la base de datos para obtener los detalles del pedido
        const detallesPedido = await obtenerDetallesPedido(mesa.numeroMesa);
        console.log('Detalles del pedido:', detallesPedido);

        const fechaActual = new Date();
        // Texto con la fecha actual en el formato deseado
        const textoFechaActual = `Fecha: ${fechaActual.toLocaleString()}`;
        // Calcula la suma de los totales de los detalles del pedido
const totalVenta = detallesPedido.DetallesPedidos.reduce((total, detalle) => {
    return total + parseFloat(detalle.Total.replace('$', '')); // Convierte el valor a número
}, 0);
    
       // Construir el contenido del informe usando los detalles obtenidos
        const contenidoInforme = {
    pageSize: {
        width: 250,
        height: 450,
    },
    content: [
        {
            stack: [
                {
                    text: 'Clover Wings',
                    fontSize: 14,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10],
                },
                {
                    text: `Factura de venta - Mesa ${mesa.numeroMesa}`,
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
                    ...detallesPedido.DetallesPedidos.map(detalle => {
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
            text: '¡Gracias por su preferencia ' + detallesPedido.nombreCliente + '!',
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
            text: 'Calle Durango, esquina Sonora. Colonia Mexico, Poza Rica, Mexico.',
            fontSize: 7,
            alignment: 'center',
            margin: [0, 0, 0, 5],
        },
        {
            text: 'Tel: 7841425806',
            fontSize: 7,
            alignment: 'center',
            margin: [0, 0, 0, 5],
        },
    ],
      };
        // Utilizar una Promise para esperar a que se genere el PDF
        return new Promise((resolve, reject) => {
            const pdfDoc = pdfMake.createPdf(contenidoInforme);

            // Generar el nombre de archivo único (por ejemplo, usando la fecha actual)
            const fileName = `Reporte${mesa.numeroMesa}_${new Date().toISOString()}.pdf`;

            // Usar el método download para guardar el PDF localmente
            pdfDoc.download(fileName, () => {
                // Resolver la Promise con la ruta del archivo
                const filePath = path.join(__dirname, fileName);
                console.log('Informe generado y guardado con éxito:', filePath);
                resolve(filePath);
            }, (error) => {
                // Rechazar la Promise si hay un error
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




    
    // EN ESTA PARTE FINALIZAREMOS EL PÉDIDO Y IMPRIMEROS EL REPORTE 
    //     Función para generar el informe
    //     async function generarInforme(mesa) {
    //         try {
    //             // Consultar la base de datos para obtener los detalles del pedido
    //             const detallesPedido = await obtenerDetallesPedido(mesa.numeroMesa);

    //             // Imprimir los detalles del pedido en la consola
    //             console.log('Detalles del pedido:', detallesPedido);

    //             // Construir el contenido del informe usando los detalles obtenidos
                

    //             // Utilizar una Promise para esperar a que se genere el PDF
    //             return new Promise((resolve, reject) => {
    //                 const pdfDoc = pdfMake.createPdf(contenidoInforme);

    //                 // Generar el nombre de archivo único (por ejemplo, usando la fecha actual)
    //                 const fileName = `Reporte${mesa.numeroMesa}_${new Date().toISOString()}.pdf`;

    //                 // Usar el método download para guardar el PDF localmente
    //                 pdfDoc.download(fileName, () => {
    //                     // Resolver la Promise con la ruta del archivo
    //                     const filePath = path.join(__dirname, fileName);
    //                     console.log('Informe generado y guardado con éxito:', filePath);
    //                     resolve(filePath);
    //                 }, (error) => {
    //                     // Rechazar la Promise si hay un error
    //                     console.error('Error al generar el informe:', error);
    //                     reject(error);
    //                 });
    //             });
    //         } catch (error) {
    //             console.error('Error al obtener detalles del pedido:', error);
    //             throw error;
    //         }
    //     }
    //     Función asincrónica para manejar la generación del informe
    //     async function handleFinalizarButtonClick(mesa) {
    //         const confirmacion = await Swal.fire({
    //             icon: 'question',
    //             title: '¿Estás seguro de finalizar el pedido?',
    //             showCancelButton: true,
    //             confirmButtonText: 'Sí, finalizar',
    //             cancelButtonText: 'Cancelar',
    //         });

    //         if (!confirmacion.isConfirmed) {
    //             return;
    //         }

    //         try {
    //             // Después de finalizar el pedido, generar el informe
    //             const filePath = await generarInforme(mesa);
    //         } catch (error) {
    //             console.error('Error al finalizar el pedido:', error);
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error al finalizar el pedido',
    //                 text: 'Hubo un error al intentar finalizar el pedido. Por favor, inténtalo de nuevo.',
    //             });
    //         }
    //     }
    //     == FUNCION PARA OBTENER EL NUMERO DE LA MESA    