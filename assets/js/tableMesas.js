var table = document.getElementById("TablaMesas");
var tbody = table.getElementsByTagName("tbody")[0];
var rows = tbody.getElementsByTagName("tr");

var searchInput = document.getElementById("searchInput");

function filterTable() {
    var searchTerm = searchInput.value.toLowerCase();
    for (var i = 0; i < rows.length; i++) {
        var rowText = rows[i].textContent.toLowerCase();
        rows[i].style.display = rowText.includes(searchTerm) ? "" : "none";
    }
}

searchInput.addEventListener("input", function () {
    filterTable();
});
