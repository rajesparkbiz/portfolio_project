var rj_main = document.getElementById("container");
var rj_total_timeLine = 30;
createTable(3);

function createTable(counter) {
    let size = counter;
    let data = "";
    data += `<table>`;
    for (let i = 0; i < size; i++) {

        data += "<tr>";
        for (let j = 0; j < size; j++) {
            data += "<td></td>"
        }
        data += "</tr>";
    }
    data += "</table>";
    rj_main.innerHTML = data;
    var rj_tds = document.querySelectorAll("td");
    var rj_random = Math.floor(Math.random() * rj_tds.length);
    var rj_r = Math.floor(Math.random() * 255);
    var rj_g = Math.floor(Math.random() * 255);
    var rj_b = Math.floor(Math.random() * 255);
    rj_tds.forEach((td) => {
        td.style.backgroundColor = `rgb(${rj_r},${rj_b},${rj_g})`;
    });

    rj_tds[rj_random].style.backgroundColor = `rgba(${rj_r},${rj_b},${rj_g},${0.1})`;
    rj_tds[rj_random].classList.add("animation");
    rj_tds[rj_random].addEventListener("click", () => {
        data = "";
        if (size == 10) {
            gameOver();
            return false;
        }
        createTable(++size);
    });
}

let rj_interval = setInterval(() => {
    if (rj_total_timeLine >= 0) {
        changeTimer();
    } else {
        gameOver();
    }
}, 1000);

function changeTimer() {
    let rj_timeLine_text = document.getElementById("timeLine");
    rj_timeLine_text.innerText = rj_total_timeLine--;
}

function gameOver() {
    alert("Game is over..");
    createTable(3);
    clearInterval(rj_interval);
}
