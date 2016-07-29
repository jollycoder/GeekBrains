// Напишите регулярное выражение для поиска HTML-цвета, заданного как #ABCDEF,
// то есть # и содержит затем 6 шестнадцатеричных символов.
var reColor = /#([a-f\d]){6}/ig;

// Создайте регэксп, который ищет все положительные числа, в том числе и с десятичной точкой.
// Например, var str = "1.5 0 12. 123.4."

// не отсеивает числа с точкой впереди вида .5
var str = "1.5 0 12. 123.4.";
var reNum = /\d+(\.\d+)?(?![\d.])/g;
console.log(str.match(reNum));

// отсеивает числа с точкой впереди вида .5
str = ".5 1.5 0 12. 123.4. 69 .78";
var res;
reNum = /(?:^|[^\d.])(?!\.)(\d+(?:\.\d+)?(?![\d.]))/g;  // [^\d.] для данного случая можно заменить на \s
while (res = reNum.exec(str))  {
    console.log(res[1]);
}

// Время может быть в формате часы:минуты или часы-минуты. И часы и минуты состоят из двух цифр, например 09:00, 21-30.
// Напишите регулярное выражение для поиска времени
var reTime = /([01]\d|2[0-3])(:|-)[0-5]\d/g;

// Написать проверку правильности координаты в файле инициализации шахматной доски c помощью регулярного выражения.
// Он должен иметь формат вида A6.
var reChessCoord = /^[A-H][1-8]$/;
