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
        self._cellsInfo[coord].color = (color == self.darkColor ? 'black' : 'white');
        cell.style.width = cell.style.height = self.cellSize;
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

ChessBoard.prototype.setActiveCell = function (coord)  {  // установка активной клетки по её координате
    (this.activeCell) && (this.activeCell.node.style.outline = '');  // снимаем выделение с предыдущей активной клетки, если была
    cellNode = this._cellsInfo[coord].node;
    cellNode.style.outline = '2px solid #808080';         // выделяем активную клетку
    this.activeCell = {name: coord, node: cellNode};
};

ChessBoard.prototype.getCoordFromNode = function (node) {   // получить координату по Node клетки
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
myBoard.initBoard('#ffce9e', '#d18b47', '35px');     // устанавливаем цвета, размеры клеток и координаты вида A1
myBoard.setOutEventHandler(function (event) {        // задаём функцию для внешней обработки событий
    switch (event.type) {
        case 'click':
            var coord = myBoard.getCoordFromNode(event.target);  // получаем координату вида A1
            myBoard.setActiveCell(coord);                        // устанавливаем активную клетку по координате
        // и т. д.
    }
});
