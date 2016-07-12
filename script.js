// Основные функции

function min(firstValue, secondValue) {
    return (secondValue < firstValue) ? secondValue : firstValue;
}

function countBs(string) {
    var count = 0;
    for (var i = 0; i < string.length; i++) {
        (string.charAt(i) == "B") && count++;
    }
    return count;
}

function countChar(string, char)  {
    var count = 0;
    for (var i = 0; i < string.length; i++) {
        (string.charAt(i) == char) && count++;
    }
    return count;
}

function isEven(number) {
    (number < 0) && (number = Math.abs(number));
    if (number == 1)
        return false;
    if (number == 0)
        return true;
    return isEven(number - 2);
}

// Вспомогательные функции

function getMin() {
    var firstValue = document.forms["form1"].elements["firstValue"].value;
    if (!firstValue) {
        alert("Введите первое значение!");
        return;
    }
    var secondValue = document.forms["form1"].elements["secondValue"].value;
    if (!secondValue) {
        alert("Введите второе значение!");
        return;
    }
    if ( !( isNaN(+firstValue) || isNaN(+secondValue) ) )  {
        firstValue = +firstValue;
        secondValue = +secondValue;
    }
    document.getElementById("minValue").innerHTML = min(firstValue, secondValue);
}

function getStringAndCountB() {
    var string = document.forms["form2"].elements["string"].value;
    if (!string )
        string = "";
    document.getElementById("howMuchB").innerHTML = countBs(string);
}

function getInfoAndCountChars() {
    var string = document.forms["form3"].elements["string"].value;
    if (!string)
        string = "";

    var char = document.forms["form3"].elements["char"].value;
    if (!char)  {
        alert("Введите символ для поиска!");
        return;
    }
    document.getElementById("howMuchChars").innerHTML = " &laquo;"
        + char + "&raquo;: " + countChar(string, char);
}

function getNumberAndDefineParity() {
    var number = +document.forms["form4"].elements["number"].value;
    document.getElementById("even").innerHTML =
        "Число " + number + (isEven(number) ? " чётное" : " нечётное");
}