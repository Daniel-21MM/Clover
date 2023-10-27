// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item => {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if (!this.classList.contains('active')) {
			allDropdown.forEach(i => {
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

if (sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item => {
		item.textContent = '-'
	})
	allDropdown.forEach(item => {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item => {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if (sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item => {
			item.textContent = '-'
		})

		allDropdown.forEach(item => {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item => {
			item.textContent = item.dataset.text;
		})
	}
})




sidebar.addEventListener('mouseleave', function () {
	if (this.classList.contains('hide')) {
		allDropdown.forEach(item => {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item => {
			item.textContent = '-'
		})
	}
})



sidebar.addEventListener('mouseenter', function () {
	if (this.classList.contains('hide')) {
		allDropdown.forEach(item => {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item => {
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

allMenu.forEach(item => {
	const icon = item.querySelector('.icon');
	const menuLink = item.querySelector('.menu-link');

	icon.addEventListener('click', function () {
		menuLink.classList.toggle('show');
	})
})



window.addEventListener('click', function (e) {
	if (e.target !== imgProfile) {
		if (e.target !== dropdownProfile) {
			if (dropdownProfile.classList.contains('show')) {
				dropdownProfile.classList.remove('show');
			}
		}
	}

	allMenu.forEach(item => {
		const icon = item.querySelector('.icon');
		const menuLink = item.querySelector('.menu-link');

		if (e.target !== icon) {
			if (e.target !== menuLink) {
				if (menuLink.classList.contains('show')) {
					menuLink.classList.remove('show')
				}
			}
		}
	})
})





// PROGRESSBAR
const allProgress = document.querySelectorAll('main .card .progress');

allProgress.forEach(item => {
	item.style.setProperty('--value', item.dataset.value)
})

// LOAD IMAGE-PROLIFE 

// Obtén una referencia al input de tipo file y la imagen
const fileInput = document.getElementById("imageInput");
const avatarImage = document.getElementById("imagenMostrada");

// Agrega un evento clic a la imagen que activará el input de archivo
avatarImage.addEventListener("click", () => {
	fileInput.click();
});

// Agrega un evento change al input de archivo para manejar la selección del archivo
fileInput.addEventListener("change", (event) => {
	// Aquí puedes manejar el archivo seleccionado, por ejemplo, mostrar una vista previa
	const selectedFile = event.target.files[0];
	if (selectedFile) {
		const reader = new FileReader();
		reader.onload = (e) => {
			// Muestra la imagen seleccionada en la vista previa
			avatarImage.src = e.target.result;
		};
		reader.readAsDataURL(selectedFile);
	}
});

// Guardar img
document.addEventListener('DOMContentLoaded', () => {
    const imagenMostrada = document.getElementById('imagenMostrada');
    const imageNav = document.getElementById('imagen-nav');
    const otrasImagenes = document.querySelectorAll('.otra-imagen'); // selecciona todas las etiquetas con la clase 'otra-imagen'
    const imageInput = document.getElementById('imageInput');
    
    // Obtener la imagen desde Local Storage si existe
    const rutaImagen = localStorage.getItem('rutaImagen');

    if (rutaImagen) {
        imagenMostrada.src = rutaImagen;
        imageNav.src = rutaImagen;

        // Establecer la misma imagen en otras etiquetas img
        otrasImagenes.forEach((imagen) => {
            imagen.src = rutaImagen;
        });
    } else {
        imagenMostrada.src = '../assets/imgUsers/imgPerfil.jpg';
        imageNav.src = '../assets/imgUsers/imgPerfil.jpg';

        // Establecer la misma imagen en otras etiquetas img
        otrasImagenes.forEach((imagen) => {
            imagen.src = '../assets/imgUsers/imgPerfil.jpg';
        });
    }

    // Agregar un evento para cambiar la imagen cuando el usuario selecciona un archivo
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                const rutaImagenTemporal = reader.result;
                localStorage.setItem('rutaImagen', rutaImagenTemporal);
                imagenMostrada.src = rutaImagenTemporal;
                imageNav.src = rutaImagenTemporal;

                // Establecer la misma imagen en otras etiquetas img
                otrasImagenes.forEach((imagen) => {
                    imagen.src = rutaImagenTemporal;
                });
            }
            reader.readAsDataURL(file);
        }
    });

    // ...otros códigos y lógica de tu aplicación
});

