var rj_player1=prompt("Enter Player1 name");
var rj_player2=prompt("Enter Player2 name");

document.getElementById("player1").innerHTML=rj_player1;
document.getElementById("player2").innerHTML=rj_player2;

document.getElementById("counter1").innerHTML=localStorage.getItem(rj_player1) ?? 0;
document.getElementById("counter2").innerHTML=localStorage.getItem(rj_player2) ?? 0;


var rj_tds = document.querySelectorAll("td");
var rj_player_flag = 0;
var rj_sign = "x";
rj_tds.forEach((td) => {
    td.addEventListener("click", () => {
        if (td.innerHTML == "" && rj_player_flag == 0) {
            td.innerHTML = "x";
            td.style.backgroundColor = "red";
            td.style.color="white";
            td.style.fontSize="50px";
            rj_player_flag = 1;
            checkCell(rj_sign);
            rj_sign = "0";
        }
        if (td.innerHTML == "" && rj_player_flag == 1) {
            td.innerHTML = "0";
            td.style.backgroundColor = "green";
            td.style.color="black";
            td.style.fontSize="50px";
            rj_player_flag = 0;
            checkCell(rj_sign);
            rj_sign = "x";
        }
    });
});

function setWinValue(p1,p2){
    var win_p1=Number.parseInt(localStorage.getItem(rj_player1) ?? 0);
    var win_p2=Number.parseInt(localStorage.getItem(rj_player2) ?? 0);
    localStorage.setItem(rj_player1,win_p1+p1);
    localStorage.setItem(rj_player2,win_p2+p2);
}

function win(sign) {
    if (sign == "x") {
        setWinValue(1,0);
        document.getElementById("counter1").innerHTML=localStorage.getItem(rj_player1);
        rj_player_flag = 0;
        rj_sign = "x";
        return `${rj_player1} win`;
    } else {
        setWinValue(0,1);
        document.getElementById("counter2").innerHTML=localStorage.getItem(rj_player2);
        rj_player_flag = 0;
        rj_sign = "x";
        return `${rj_player2} win`;
    }
}

function addAnimation(p1,p2,p3){
    setTimeout(()=>{
        location.reload();
    },3200);
    rj_tds[p1].classList.add("animation");
    rj_tds[p2].classList.add("animation");
    rj_tds[p3].classList.add("animation");
}

function checkCell(sign) {
    if (rj_tds[0].innerHTML == sign && rj_tds[1].innerHTML == sign && rj_tds[2].innerHTML == sign) {
        alert(win(sign));
        addAnimation(0,1,2);
    } else if (rj_tds[3].innerHTML == sign && rj_tds[4].innerHTML == sign && rj_tds[5].innerHTML == sign) {
        alert(win(sign));
        addAnimation(3,4,5);

    }
    else if (rj_tds[6].innerHTML == sign && rj_tds[7].innerHTML == sign && rj_tds[8].innerHTML == sign) {
        alert(win(sign));
        addAnimation(6,7,8);

    }
    else if (rj_tds[0].innerHTML == sign && rj_tds[3].innerHTML == sign && rj_tds[6].innerHTML == sign) {
        alert(win(sign));
        addAnimation(0,3,6);

    }
    if (rj_tds[1].innerHTML == sign && rj_tds[4].innerHTML == sign && rj_tds[7].innerHTML == sign) {
        alert(win(sign));
        addAnimation(1,4,7);

    }
    else if (rj_tds[2].innerHTML == sign && rj_tds[5].innerHTML == sign && rj_tds[8].innerHTML == sign) {
        alert(win(sign));
        addAnimation(2,5,8);
    }
    else if (rj_tds[0].innerHTML == sign && rj_tds[4].innerHTML == sign && rj_tds[8].innerHTML == sign) {
        alert(win(sign));
        addAnimation(0,4,8);
    }
    else if (rj_tds[2].innerHTML == sisetWinValuegn && rj_tds[4].innerHTML == sign && rj_tds[6].innerHTML == sign) {
        alert(win(sign));
        addAnimation(2,4,6);
    }
    else if (rj_tds[0].innerHTML != "" && rj_tds[1].innerHTML != "" && rj_tds[2].innerHTML != "" && rj_tds[3].innerHTML != "" && rj_tds[4].innerHTML != "" && rj_tds[5].innerHTML != "" && rj_tds[6].innerHTML != "" && rj_tds[7].innerHTML != "" && rj_tds[8].innerHTML != "") {
        alert("Match Draw");
        return false;
    }
}


function restartGame(){
    location.reload();
    rj_tds.forEach((td)=>{
        td.innerText="";
        td.style.backgroundColor = "lavenderblush";
    });
}

function clearStorage(){
    let res=confirm("Are You Sure?");
    if(res==true){
        localStorage.clear();
    }else{
        return false;
    }
}