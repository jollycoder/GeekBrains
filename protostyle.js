function Table() {
    this.rowsNumber = 1;
    this.cellsNumber = 1;
}

Table.prototype.size = function (rowsNumber, cellsNumber) {
    this.rowsNumber = rowsNumber || 1;
    this.cellsNumber = cellsNumber || 1;
};

Table.prototype.createTable = function (func) {  // в параметре функция func для работы с создаваемыми ячейками
    var table = document.createElement("table");
    for (var r = 0; r <= this.rowsNumber - 1; r++) {
        var row = table.insertRow();
        for (var c = 0; c <= this.cellsNumber - 1; c++) {
            var cell = row.insertCell();
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
}

ChessBoard.prototype = Object.create(Table.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.initBoard = function (lightColor, darkColor, cellSize) {  // установка цветов и размера клеток
    this.size(this._rowsNumber, this._cellsNumber);    // инициализация доски
    this.lightColor = lightColor || 'white';
    this.darkColor = darkColor || 'black';
    this.cellSize = cellSize || '30px';

    var self = this;
    var f = function (r, c, cell) {
        if (r % 2 == 0)
            var color = (c % 2 == 0 ? self.lightColor : self.darkColor);
        else
            color = (c % 2 == 0 ? self.darkColor : self.lightColor);
        cell.style.backgroundColor = color;
        cell.style.width = cell.style.height = self.cellSize;
        cell.setAttribute( 'data-id', self._letters[c] + (8 - r).toString() );  // устанавливаем каждой ячейке атрибут data-id с координатой вида A1
    };
    this.table = this.createTable(f);
    this.table.style.borderSpacing = "0";
    document.getElementById(this._id).appendChild(this.table);
};

ChessBoard.prototype.setActiveCell = function (cellNode)  {
    (this.activeCell) && (this.activeCell.node.style.outline = "");  // снимаем выделение с предыдущей активной клетки, если была
    cellNode.style.outline = "2px solid #808080";         // выделяем активную клетку
    this.activeCell = {name: cellNode.getAttribute('data-id'), node: cellNode};
    alert("Активная клетка: " + this.activeCell.name);
};

ChessBoard.prototype.setOnEvents = function (handler) {                   // подписываемся на события
    var self = this;
    ['click', 'dblclick', 'contextmenu', 'mouseover', 'mousedown', 'mouseup', 'mousemove'].forEach(function (item) {
        self.table.addEventListener(item, handler);
    });
};

myBoard = new ChessBoard("chessboardPlace");         // создаём доску в элементе с id "chessboardPlace"
myBoard.initBoard("#ffce9e", "#d18b47", "35px");     // устанавливаем цвета, размеры клеток и координаты
myBoard.setOnEvents(function eventHandler(event) {   // подписываемся на события
    switch(event.type)  {
        case 'click':
            myBoard.setActiveCell(event.target);
        // и т. д.
    }
});
