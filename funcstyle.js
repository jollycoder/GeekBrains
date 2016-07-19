function Table() {
    this.size = function (rowsNumber, cellsNumber) {
        this.rowsNumber = rowsNumber || 1;
        this.cellsNumber = cellsNumber || 1;
    };
    this.createTable = function () {
        var table = document.createElement("table");
        for (var i = 1; i <= this.rowsNumber; i++) {
            var row = table.insertRow();
            for (var n = 1; n <= this.cellsNumber; n++)  row.insertCell();
        }
        return table;  // возвращает Node таблицы
    };
}

function ChessBoard(id) {
    Table.call(this);

    var self = this;
    var rowsNumber = 8, cellsNumber = 8;                        // внутренние свойства, постоянные для шахматной доски
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    this.initBoard = function (lightColor, darkColor, cellSize) {  // установка цветов и размера клеток
        this.size(rowsNumber, cellsNumber);    // инициализация доски
        this.table = this.createTable();
        this.table.style.borderSpacing = "0";

        document.getElementById(id).appendChild(this.table);
        this.lightColor = lightColor || 'white';
        this.darkColor = darkColor || 'black';
        this.cellSize = cellSize || '30px';

        for (var r = 0; r <= rowsNumber - 1; r++)  {
            var row = this.table.rows[r];
            for (var c = 0; c <= cellsNumber - 1; c++)  {
                var cell = row.cells[c];
                if (r % 2 == 0)
                    var color = (c % 2 == 0 ? this.lightColor : this.darkColor);
                else
                    color = (c % 2 == 0 ? this.darkColor : this.lightColor);
                cell.style.backgroundColor = color;
                cell.style.width = cell.style.height = this.cellSize;
                cell.setAttribute( 'data-id', letters[c] + (8 - r).toString() );  // устанавливаем каждой ячейке атрибут data-id с координатой вида A1
            }
        }
    };
    this.setOnEvents = function () {                   // подписываемся на события
        ['click', 'dblclick', 'contextmenu', 'mouseover', 'mousedown', 'mouseup', 'mousemove'].forEach(function (item) {
            self.table.addEventListener(item, eventHandler);
        });
    };
    function eventHandler(event) {
        switch(event.type)  {
            case 'click':
                self.setActiveCell(event.target);
            // и т. д.
        }
    }
    this.setActiveCell = function (cellNode)  {
        (this.activeCell) && (this.activeCell.node.style.outline = "");  // снимаем выделение с предыдущей активной клетки, если была
        cellNode.style.outline = "2px solid #808080";         // выделяем активную клетку
        this.activeCell = {name: cellNode.getAttribute('data-id'), node: cellNode};
        alert("Активная клетка: " + this.activeCell.name);
    };
}

myBoard = new ChessBoard("chessboardPlace");         // создаём доску в элементе с id "chessboardPlace"
myBoard.initBoard("#ffce9e", "#d18b47", "35px");     // устанавливаем цвета, размеры клеток и координаты
myBoard.setOnEvents();                               // подписываемся на события