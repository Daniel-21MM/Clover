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
