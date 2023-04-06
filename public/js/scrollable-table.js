var table = document.getElementById("scrollable_table");
function chnageTableSize(data) {


    document.getElementById("display_size").innerHTML = data;
    var range = document.getElementById("table_size");
    range.addEventListener("input", (temp) => {
        let data = "";
        for (let i = 1; i <= temp.target.value; i++) {
            data += "<tr>";
            for (let j = 1; j <= temp.target.value; j++) {
                data += `<td>(${i},${j})</td>`;
            }
            data += "</tr>";    
        }
        table.innerHTML = data;

        var allTds = document.querySelectorAll("td");
        allTds.forEach((td) => {
            td.addEventListener("mouseover", () => {
                td.style.backgroundColor = "red";
            });
            
        });
        allTds.forEach((td) => {
            td.addEventListener("mouseout", () => {
                td.style.backgroundColor = "white";
            });

        });
    });
}


