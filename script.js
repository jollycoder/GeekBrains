function triangle() {  // первое задание — треугольник
    var html = "";

    for (var i = 1; i <= 7; i++) {
        for (var n = 1; n <= i; n++) {
            html += "#";
        }
        html += "<br>";
    }
    document.getElementById("output1").innerHTML = html;
}
function lattice() {  // второе задание — решётка
    var html = "<pre>";
    var output = document.getElementById("output2");

    for (var i = 1; i <= 8; i++) {
        for (var n = 1; n <= 8; n++) {
            if (i % 2 == 0)
                html += (n % 2 == 0 ? " " : "#");
            else
                html += (n % 2 == 0 ? "#" : " ");
        }
        html += "<br>";
    }
    output.innerHTML = html + "</pre>";
}
function chessTable() {  // третье задание — шахматная доска
    var row, cell, color, output, table, i, n;
    output = document.getElementById("output3");
    if (output.childNodes.length == 1)
        return;
    table = document.createElement("table");
    table.style.margin = "10px auto";
    table.style.borderSpacing = "0";
    output.appendChild(table);

    for (i = 1; i <= 8; i++) {
        row = table.insertRow();
        for (n = 1; n <= 8; n++) {
            cell = row.insertCell();
            if (i % 2 == 0)
                color = (n % 2 == 0 ? "#ffce9e" : "#d18b47");
            else
                color = (n % 2 == 0 ? "#d18b47" : "#ffce9e");
            cell.style.backgroundColor = color;
            cell.style.width = cell.style.height = "30px";
        }
    }
}

// функция для показа/скрытия кнопки "Clear" и вывода скриптов
function showHideOutput(event) {
    var buttonID = event.target.id;
    var buttonNumber = buttonID.slice(-1);

    if (buttonID.slice(0, -1) == "run")
        document.getElementById("clear" + buttonNumber).style.display = "inline";
    else {
        document.getElementById("output" + buttonNumber).innerHTML = "";
        document.getElementById(buttonID).style.display = "none";
    }
}