function Table(rowsNumber, cellsNumber) {
    this.rowsNumber = rowsNumber || 1;
    this.cellsNumber = cellsNumber || 1;
}

Table.prototype.createTable = function (func) {  // в параметре функция func для работы с создаваемыми ячейками
    var table = document.createElement('table');
    for (var r = 0; r <= this.rowsNumber - 1; r++) {
        var row = table.insertRow();
        for (var c = 0; c <= this.cellsNumber - 1; c++) {
            var cell = row.insertCell(c);
            (typeof func === 'function') && func(r, c, cell);
        }
    }
    return table;
};

function ChessBoard(parentId) {
    var rowsNumber = 8, cellsNumber = 8;
    this._parentId = parentId;
    this._letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    this._cellsInfo = {};   // коллекция для записи информации о клетках
    Table.call(this, rowsNumber, cellsNumber);
}

ChessBoard.prototype = Object.create(Table.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.initBoard = function (lightColor, darkColor, cellSize) {  // установка цветов и размера клеток
    var self = this;
    this.lightColor = lightColor || 'white';
    this.darkColor = darkColor || 'black';
    this.cellSize = cellSize || '30px';

    this.table = this.createTable(function (r, c, cell) {
        var coord = self._letters[c] + (8 - r);
        cell.setAttribute('data-id', coord);  // устанавливаем каждой ячейке атрибут data-id с координатой вида A1
        self._cellsInfo[coord] = {node: cell};
        var s = cell.style;
        s.backgroundColor = (r + c) % 2 ? self.darkColor : self.lightColor;
        s.width = s.height = self.cellSize;
        s.padding = '0';
        self._cellsInfo[coord].color = (r + c) % 2 ? 'black' : 'white';
    });

    this.table.style.borderSpacing = '0';
    document.getElementById(this._parentId).appendChild(this.table);

    this.addEventListener('dblclick', function(event) {
        alert('dblclick по клетке ' + self.getCoordFromNode(event.target));
    });
};

ChessBoard.prototype.setPosition = function (jsonFile) {
    var self = this;
    var timeout = 5000;
    var pieces = ['K', 'Q', 'R', 'B', 'N', 'p'];
    var ci = this._cellsInfo;

    var setPosition = function (piecesData) {
        validateData(piecesData) && clearBoard() && setPiecesFromData(piecesData);
    };

    if (jsonFile) {
        getPositionFromJson(jsonFile, timeout, setPosition);
    }
    else {
        var piecesData = getStartPosition();
        setPosition(piecesData);
    }

    function getPositionFromJson(url, timeout, successFunc) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.timeout = timeout;
        xhr.ontimeout = function() {
            alert( 'Извините, запрос превысил максимальное время' );
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4)
                return;
            if (xhr.status != 200)
                alert(xhr.status + ': ' + xhr.statusText);
            else {
                try  {
                    var data = JSON.parse(xhr.responseText);
                    successFunc(data);
                }
                catch (e)  {
                    alert( "Некорректный ответ " + e.message );
                }
            }
        };
        xhr.send();
    }

    function getStartPosition() {
        return {
            white: {
                K: ['E1'],
                Q: ['D1'],
                R: ['A1', 'H1'],
                B: ['C1', 'F1'],
                N: ['B1', 'G1'],
                p: ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2']
            },
            black: {
                K: ['E8'],
                Q: ['D8'],
                R: ['A8', 'H8'],
                B: ['C8', 'F8'],
                N: ['B8', 'G8'],
                p: ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']
            }
        };
    }

    function clearBoard()  {
        for (var key in ci) {
            if (ci[key].content) {
                var node = ci[key].node;
                node.removeChild(node.firstChild);
                ci[key].content = null;
            }
        }
        return true;
    }

    function setPiecesFromData(data) {
        for (var color in data) {
            for (var piece in data[color]) {
                data[color][piece].forEach(function (coord) {
                    var pieceDiv = document.createElement('div');
                    pieceDiv.innerHTML = '&#98' + (12 + pieces.indexOf(piece) + (color == 'white' ? 0 : 6)) + ';';
                    setStyles(pieceDiv.style);
                    ci[coord].node.appendChild(pieceDiv);
                    ci[coord].content = pieceDiv;
                });
            }
        }
    }

    function setStyles(s) {
        s.textAlign = 'center';
        s.fontSize = +self.cellSize.slice(0, -2) * 90 / 100 + 'px';
        s.width = s.height = s.lineHeight = self.cellSize;
        s.webkitUserSelect = s.mozUserSelect = s.msUserSelect = 'none';
        s.cursor = 'pointer';
    }

    function validateData(data) {
        var testCoord = [];
        var keys = Object.keys(data);
        if (keys.indexOf('white') == -1 || keys.indexOf('black') == -1 || keys.length != 2) {
            alert('Неверный формат данных!');
            return false;
        }
        return !keys.some(function (color) {
            var obj = data[color];
            if ((typeof obj) != 'object') {
                alert('Неверный формат данных!');
                return true;
            }
            return Object.keys(obj).some(function (piece) {
                if (!piece.match(/^[KQRBNp]$/))  {                                                       // RegExp
                    alert('Неверный формат данных!');
                    return true;
                }
                if (piece == 'K' && obj[piece].length != 1) {
                    alert('Ошибка в расстановке позиции, два короля одного цвета!');
                    return true;
                }
                if (piece == 'p' && obj[piece].length > 8) {
                    alert('Ошибка в расстановке позиции, слишком много пешек одного цвета!');
                    return true;
                }
                return obj[piece].some(function (coord) {
                    if (!coord.match(/^[A-H][1-8]$/))  {                                                 // RegExp
                        alert('Неверный формат данных!');
                        return true;
                    }
                    if (piece == 'p' && color == 'white' && coord.slice(-1) == '1') {
                        alert('Ошибка в расстановке позиции, белая пешка на ' + coord + '!');
                        return true;
                    }
                    if (piece == 'p' && color == 'black' && coord.slice(-1) == '8') {
                        alert('Ошибка в расстановке позиции, чёрная пешка на ' + coord + '!');
                        return true;
                    }
                    if (testCoord.indexOf(coord) == -1) {
                        testCoord.push(coord);
                    }
                    else {
                        alert('Ошибка в расстановке позиции, повторяются координаты!');
                        return true;
                    }
                });
            });
        });
    }
};

ChessBoard.prototype.setActiveCell = function (coord) {  // установка активной клетки по её координате
    this.activeCell && (this.activeCell.node.style.outline = '');  // снимаем выделение с предыдущей активной клетки, если была
    cellNode = this._cellsInfo[coord].node;
    cellNode.style.outline = '2px solid #808080';         // выделяем активную клетку
    this.activeCell = {name: coord, node: cellNode};
};

ChessBoard.prototype.getCoordFromNode = function (node) {   // получить координату по Node клетки
    (node.tagName == 'DIV') && (node = node.parentNode);
    for (var key in this._cellsInfo) {
        if (this._cellsInfo[key].node === node)
            return key;
    }
};

ChessBoard.prototype.addEventListener = function (event, handler) {
    this.table.addEventListener(event, handler);
};

ChessBoard.prototype.setDragAndDrop = function () {
    var self = this;
    var pieceSelector = "#chessboardPlace td div";
    $(pieceSelector).draggable();
    $("#chessboardPlace td").droppable({drop: function (event, ui) {
        var html = ui.draggable.html();
        $(ui.draggable).remove();
        var pieceDiv = document.createElement('div');
        pieceDiv.innerHTML = html;
        setStyles(pieceDiv.style);
        $(this).empty().append(pieceDiv);
        $(pieceSelector).draggable();
        var coord = self.getCoordFromNode($(this).get(0));
        self._cellsInfo[coord].content = pieceDiv;
    }});

    function setStyles(s) {
        s.textAlign = 'center';
        s.fontSize = +self.cellSize.slice(0, -2) * 90 / 100 + 'px';
        s.width = s.height = s.lineHeight = self.cellSize;
        s.webkitUserSelect = s.mozUserSelect = s.msUserSelect = 'none';
        s.cursor = 'pointer';
    }
};

myBoard = new ChessBoard('chessboardPlace');         // создаём доску в элементе с id 'chessboardPlace'
myBoard.initBoard('#ffce9e', '#d18b47', '50px');     // устанавливаем цвета, размеры клеток и координаты вида A1
myBoard.addEventListener('click', function (event) {        // задаём функцию для внешней обработки событий
    var coord = myBoard.getCoordFromNode(event.target);  // получаем координату вида A1
    myBoard.setActiveCell(coord);                        // устанавливаем активную клетку по координате
});
myBoard.setPosition();  // без параметра — начальная позиция
myBoard.setDragAndDrop();
/*
setTimeout(function () {
    myBoard.setPosition('position.json')
}, 2000);  // позиция из json-файла
*/
