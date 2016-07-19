function Table() {}

Table.prototype.size = function (rowsNumber, cellsNumber) {
    this.rowsNumber = rowsNumber || 1;
    this.cellsNumber = cellsNumber || 1;
};

Table.prototype.createTable = function () {
    var table = document.createElement("table");
    for (var i = 1; i <= this.rowsNumber; i++) {
        var row = table.insertRow();
        for (var n = 1; n <= this.cellsNumber; n++)  row.insertCell();
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
    this.table = this.createTable();
    this.table.style.borderSpacing = "0";

    document.getElementById(this._id).appendChild(this.table);
    this.lightColor = lightColor || 'white';
    this.darkColor = darkColor || 'black';
    this.cellSize = cellSize || '30px';

    for (var r = 0; r <= this._rowsNumber - 1; r++)  {
        var row = this.table.rows[r];
        for (var c = 0; c <= this._cellsNumber - 1; c++)  {
            var cell = row.cells[c];
            if (r % 2 == 0)
                var color = (c % 2 == 0 ? this.lightColor : this.darkColor);
            else
                color = (c % 2 == 0 ? this.darkColor : this.lightColor);
            cell.style.backgroundColor = color;
            cell.style.width = cell.style.height = this.cellSize;
            cell.setAttribute( 'data-id', this._letters[c] + (8 - r).toString() );  // устанавливаем каждой ячейке атрибут data-id с координатой вида A1
        }
    }
};

ChessBoard.prototype.setActiveCell = function (cellNode)  {
    (this.activeCell) && (this.activeCell.node.style.outline = "");  // снимаем выделение с предыдущей активной клетки, если была
    cellNode.style.outline = "2px solid #808080";         // выделяем активную клетку
    this.activeCell = {name: cellNode.getAttribute('data-id'), node: cellNode};
    alert("Активная клетка: " + this.activeCell.name);
};

ChessBoard.prototype.setOnEvents = function () {                   // подписываемся на события
    var self = this;
    ['click', 'dblclick', 'contextmenu', 'mouseover', 'mousedown', 'mouseup', 'mousemove'].forEach(function (item) {
        self.table.addEventListener(item, eventHandler);
    });
    function eventHandler(event) {
        switch(event.type)  {
            case 'click':
                self.setActiveCell(event.target);
            // и т. д.
        }
    }
};

myBoard = new ChessBoard("chessboardPlace");         // создаём доску в элементе с id "chessboardPlace"
myBoard.initBoard("#ffce9e", "#d18b47", "35px");     // устанавливаем цвета, размеры клеток и координаты
myBoard.setOnEvents();                               // подписываемся на события