// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item=> {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if(!this.classList.contains('active')) {
			allDropdown.forEach(i=> {
				const aLink = i.parentElement.querySelector('a:first-child');

				aLink.classList.remove('active');
				i.classList.remove('show');
			})
		}

		this.classList.toggle('active');
		item.classList.toggle('show');
	})
})

// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if(sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item=> {
		item.textContent = '-'
	})
	allDropdown.forEach(item=> {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item=> {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if(sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})

		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})


sidebar.addEventListener('mouseleave', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})
	}
})

sidebar.addEventListener('mouseenter', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})

// PROFILE DROPDOWN
const profile = document.querySelector('nav .profile');
const imgProfile = profile.querySelector('img');
const dropdownProfile = profile.querySelector('.profile-link');

imgProfile.addEventListener('click', function () {
	dropdownProfile.classList.toggle('show');
})

// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu');

allMenu.forEach(item=> {
	const icon = item.querySelector('.icon');
	const menuLink = item.querySelector('.menu-link');

	icon.addEventListener('click', function () {
		menuLink.classList.toggle('show');
	})
})


window.addEventListener('click', function (e) {
	if(e.target !== imgProfile) {
		if(e.target !== dropdownProfile) {
			if(dropdownProfile.classList.contains('show')) {
				dropdownProfile.classList.remove('show');
			}
		}
	}

	allMenu.forEach(item=> {
		const icon = item.querySelector('.icon');
		const menuLink = item.querySelector('.menu-link');

		if(e.target !== icon) {
			if(e.target !== menuLink) {
				if (menuLink.classList.contains('show')) {
					menuLink.classList.remove('show')
				}
			}
		}
	})
})


// PROGRESSBAR
const allProgress = document.querySelectorAll('main .card .progress');

allProgress.forEach(item=> {
	item.style.setProperty('--value', item.dataset.value)
})

// MOSTRAR IMAGEN 
document.addEventListener('DOMContentLoaded', () => {
    const imagenEnOtraPagina = document.getElementById('imagenEnOtraPagina');
    
    // Obtener la imagen desde Local Storage si existe
    const rutaImagen = localStorage.getItem('rutaImagen');

    if (rutaImagen) {
        imagenEnOtraPagina.src = rutaImagen;
    } else {
        imagenEnOtraPagina.src = 'ruta_predeterminada.jpg'; // Ruta predeterminada si no hay imagen en Local Storage
    }
});


// FILTER AND PAGINATION OF TABLE USERS 

var table = document.getElementById("miTabla");
var tbody = table.getElementsByTagName("tbody")[0];
var rows = tbody.getElementsByTagName("tr");

var searchInput = document.getElementById("searchInput");
var prevPageButton = document.getElementById("prevPage");
var nextPageButton = document.getElementById("nextPage");

var itemsPerPage = 5;
var currentPage = 0;
var totalPages = Math.ceil(rows.length / itemsPerPage);

function showPage(page) {
    for (var i = 0; i < rows.length; i++) {
        if (i < page * itemsPerPage || i >= (page + 1) * itemsPerPage) {
            rows[i].style.display = "none";
        } else {
            rows[i].style.display = "";
        }
    }
}

function updatePagination() {
    prevPageButton.disabled = currentPage === 0;
    nextPageButton.disabled = currentPage === totalPages - 1;
}

showPage(currentPage);
updatePagination();

searchInput.addEventListener("input", function () {
    var searchTerm = searchInput.value.toLowerCase();
    for (var i = 0; i < rows.length; i++) {
        var rowText = rows[i].textContent.toLowerCase();
        rows[i].style.display = rowText.includes(searchTerm) ? "" : "none";
    }

    // Si el input de búsqueda está vacío, mantenemos la página actual
    if (searchTerm === "") {
        showPage(currentPage);
    } else {
        currentPage = 0;
    }

    updatePagination();
});

prevPageButton.addEventListener("click", function () {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
        updatePagination();
    }
});

nextPageButton.addEventListener("click", function () {
    if (currentPage < totalPages - 1) {
        currentPage++;
        showPage(currentPage);
        updatePagination();
    }
});
