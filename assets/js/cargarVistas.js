document.addEventListener("DOMContentLoaded", function() {
    const linkCargarPrueba = document.querySelector("#pruebaCargar");

    linkCargarPrueba.addEventListener("click", function(event) {
        event.preventDefault();

        fetch("prueba.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const contenidoPrueba = document.createElement('div');
                contenidoPrueba.innerHTML = data;

                const contenidoMain = document.querySelector('main');
                contenidoMain.innerHTML = ''; // Limpiar contenido existente
                contenidoMain.appendChild(contenidoPrueba);
            })
            .catch(error => {
                console.error('Fetch failed:', error);
            });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const linkCargarPrueba = document.querySelector("#listUsersView");

    linkCargarPrueba.addEventListener("click", function(event) {
        event.preventDefault();

        fetch("listUsers.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const viewListUsers = document.createElement('div');
                viewListUsers.innerHTML = data;

                const contenidoMain = document.querySelector('main');
                contenidoMain.innerHTML = ''; 
                contenidoMain.appendChild(viewListUsers);
            })
            .catch(error => {
                console.error('Fetch failed:', error);
            });
    });
});

