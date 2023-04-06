let rows=prompt("Enter Number of Rows");
let cols=prompt("Enter Number of columns");
   
var table=document.getElementById("dynamic_table");

// var tbody=document.createElement("tbody");

for(let i=0;i<rows;i++){
    var newTr=document.createElement("tr");
    //newTr.classList.add(i);
    table.appendChild(newTr);   
    
    for(let j=0;j<cols;j++){    
        var newTd=document.createElement("td");
        newTr.appendChild(newTd);
        //newTr.classList.add(j);
        newTd.appendChild(document.createTextNode("Hover me"));
    }
    
}


var alltr=document.querySelectorAll("td");

alltr.forEach((value,number)=>{
    value.addEventListener("mouseover",()=>{
        value.style.backgroundColor="#F39C12";
    });
});


alltr.forEach((node)=>{
    node.addEventListener("mouseout",()=>{
        node.style.backgroundColor="#D6EAF8";
    });
});
