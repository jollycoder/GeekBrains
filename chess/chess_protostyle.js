function Table() {
    this.rowsNumber = 1;  // значения по умолчанию
    this.cellsNumber = 1;
}

Table.prototype.size = function (rowsNumber, cellsNumber) {
    this.rowsNumber = rowsNumber;
    this.cellsNumber = cellsNumber;
};

Table.prototype.createTable = function (func) {  // в параметре функция func для работы с создаваемыми ячейками
    var table = document.createElement('table');
    for (var r = 0; r <= this.rowsNumber - 1; r++) {
        var row = table.insertRow();
        for (var c = 0; c <= this.cellsNumber - 1; c++) {
            var cell = row.insertCell();
            if (typeof func === 'function')
                func(r, c, cell);
        }
    }
    return table;
};

function ChessBoard(id)  {
    this._id = id;
    this._rowsNumber = 8;               // защищённые свойства, постоянные для шахматной доски
    this._cellsNumber = 8;
    this._letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    this._cellsInfo = {};   // коллекция для записи информации о клетках
}

ChessBoard.prototype = Object.create(Table.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.initBoard = function (lightColor, darkColor, cellSize) {  // установка цветов и размера клеток
    this.size(this._rowsNumber, this._cellsNumber);    // инициализация доски
    this.lightColor = lightColor || 'white';
    this.darkColor = darkColor || 'black';
    this.cellSize = cellSize || '30px';
    this.outEventHandler = null;   // параметр для передачи внешней функции-обработчика событий

    var self = this;
    function putBoardInfo(r, c, cell) {
        var coord = self._letters[c] + (8 - r).toString();
        cell.setAttribute('data-id', coord);  // устанавливаем каждой ячейке атрибут data-id с координатой вида A1
        self._cellsInfo[coord] = {node: cell};
        if (r % 2 == 0)
            var color = (c % 2 == 0 ? self.lightColor : self.darkColor);
        else
            color = (c % 2 == 0 ? self.darkColor : self.lightColor);
        cell.style.backgroundColor = color;
        cell.style.width = cell.style.height = self.cellSize;
        cell.style.padding = '0';
        self._cellsInfo[coord].color = (color == self.darkColor ? 'black' : 'white');
    }
    this.table = this.createTable(putBoardInfo);
    this.table.style.borderSpacing = '0';
    document.getElementById(this._id).appendChild(this.table);

    ['click', 'dblclick', 'contextmenu', 'mouseover', 'mousedown', 'mouseup', 'mousemove'].forEach(function (item) {  // подписываемся на события
        self.table.addEventListener(item, eventHandler);
    });
    function eventHandler(event) {
        switch (event.type) {
            case 'dblclick':
                alert('dblclick по клетке ' + self.getCoordFromNode(event.target));
            // и т. д.
        }
        if (typeof self.outEventHandler === 'function')
            self.outEventHandler(event);                // передаём события внешнему обработчику
    }
};

ChessBoard.prototype.setPosition = function (jsonFile) {
    var self = this;
    var pieces = ['K', 'Q', 'R', 'B', 'N', 'p'];
    var ci = this._cellsInfo;
    if (!jsonFile)  {
        var piecesData = {
            white: {
                K:  'E1',
                Q:  'D1',
                R: ['A1', 'H1'],
                B: ['C1', 'F1'],
                N: ['B1', 'G1'],
                p: ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2']
            },
            black: {
                K:  'E8',
                Q:  'D8',
                R: ['A8', 'H8'],
                B: ['C8', 'F8'],
                N: ['B8', 'G8'],
                p: ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']
            }
        };
    }
    else  {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', jsonFile, false);
        xhr.send();
        if (xhr.status != 200) {
            return alert(xhr.status + ': ' + xhr.statusText);
        }
        piecesData = JSON.parse(xhr.responseText);
    }
    if (!this.validateData(piecesData))   // валидация данных
        return;

    for (var key in ci)  {    // удаляем фигуры из клеток, если есть
        if (ci[key].content)  {
            var node = ci[key].node;
            node.removeChild(node.firstChild);
            ci[key].content = null;
        }
    }
    for (var color in piecesData)  {   // заполняем клетки фигурами в соответствии с данными
        for (var piece in piecesData[color])  {
            var obj = piecesData[color];
            if (typeof obj[piece] === 'string')  {
                setPiece(color, piece, obj[piece]);
            }
            else  {
                obj[piece].forEach(function (item) {
                    setPiece(color, piece, item);
                });
            }
        }
    }
    function setPiece(color, piece, coord) {
        var pieceDiv = document.createElement('div');
        pieceDiv.innerHTML = '&#98' + (12 + pieces.indexOf(piece) + (color == 'white' ? 0 : 6)).toString() + ';';
        var s = pieceDiv.style;
        s.textAlign = 'center';
        s.fontSize = (+self.cellSize.slice(0, -2) * 90 / 100).toString() + 'px';
        s.width = s.height = s.lineHeight = self.cellSize;
        s.webkitUserSelect = 'none';
        s.mozUserSelect = 'none';
        s.msUserSelect = 'none';
        s.cursor = 'default';
        ci[coord].node.appendChild(pieceDiv);
        ci[coord].content = 1;   // временно
    }
};

ChessBoard.prototype.validateData = function (obj) {
    var keys = Object.keys(obj);
    var error = false
    if (keys.indexOf('white') == -1 || keys.indexOf('black') == -1 || keys.length != 2)  {
        alert('Неверный формат данных!');
        return false;
    }
    var coords = [];   // проверка на совпадение координат
    keys.forEach(function (color) {
        if((typeof obj[color]) != 'object')  {
            alert('Неверный формат данных!');
            error = true;
        }
        var pieces = Object.keys(obj[color]);
        pieces.some(function (pos) {
            if ((typeof obj[color][pos]) == 'string')  {
                if (coords.indexOf(obj[color][pos]) != -1)  {
                    alert('Ошибка в расстановке позиции, повторяются координаты!');
                    return error = true;
                }
                else  {
                    coords.push(obj[color][pos]);
                }
            }
            else  {
                if (pos == 'K')  {
                    alert('Ошибка в расстановке позиции, два короля одного цвета!');
                    return error = true;
                }
                if (pos == 'p' && obj[color][pos].length > 8)  {
                    alert('Ошибка в расстановке позиции, слишком много пешек одного цвета!');
                    return error = true;
                }
                obj[color][pos].some(function (coord) {
                    if (pos == 'p' && color == 'white' && coord.slice(-1) == '1')  {
                        alert('Ошибка в расстановке позиции, белая пешка на ' + coord + '!');
                        return error = true;
                    }
                    if (pos == 'p' && color == 'black' && coord.slice(-1) == '8')  {
                        alert('Ошибка в расстановке позиции, чёрная пешка на ' + coord + '!');
                        return error = true;
                    }
                    if (coords.indexOf(coord) != -1)  {
                        alert('Ошибка в расстановке позиции, повторяются координаты!');
                        return error = true;
                    }
                    else  {
                        coords.push(coord);
                    }
                });
            }
            return error;
        });
    });
    return !error;
};

ChessBoard.prototype.setActiveCell = function (coord)  {  // установка активной клетки по её координате
    (this.activeCell) && (this.activeCell.node.style.outline = '');  // снимаем выделение с предыдущей активной клетки, если была
    cellNode = this._cellsInfo[coord].node;
    cellNode.style.outline = '2px solid #808080';         // выделяем активную клетку
    this.activeCell = {name: coord, node: cellNode};
};

ChessBoard.prototype.getCoordFromNode = function (node) {   // получить координату по Node клетки
    if (node.tagName == 'DIV') {
        node = node.parentNode;
    }
    for (var key in this._cellsInfo)  {
        if (this._cellsInfo[key].node === node) {
            return key;
        }
    }
};

ChessBoard.prototype.setOutEventHandler = function (handler) {
    this.outEventHandler = handler;
};

myBoard = new ChessBoard('chessboardPlace');         // создаём доску в элементе с id 'chessboardPlace'
myBoard.initBoard('#ffce9e', '#d18b47', '50px');     // устанавливаем цвета, размеры клеток и координаты вида A1
myBoard.setOutEventHandler(function (event) {        // задаём функцию для внешней обработки событий
    switch (event.type) {
        case 'click':
            var coord = myBoard.getCoordFromNode(event.target);  // получаем координату вида A1
            myBoard.setActiveCell(coord);                        // устанавливаем активную клетку по координате
        // и т. д.
    }
});
myBoard.setPosition();  // без параметра — начальная позиция
setTimeout(function() {myBoard.setPosition('position.json')}, 2000);  // позиция из json-файла
