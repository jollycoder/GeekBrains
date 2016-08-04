function Canvas(options) {
    var elem = options.elem;
    var context = elem.getContext('2d');
    if (!context) {
        alert('Скачай нормальный браузер');
        return;
    }

    this.setStrokeStyle = function (color) {
        context.strokeStyle = color;
    };

    this.setFillStyle = function (color) {
        context.fillStyle = color;
    };

    this.setLineWidth = function (width) {
        context.lineWidth = width;
    };

    this.drawArc = function (center, r, angle, direction, fillType) {
        context.beginPath();
        context.arc(center.x, center.y, r, angle.start, angle.end, direction);
        fillType == 'fill' ? context.fill() : context.stroke();
        context.closePath();
    };

    this.drawLines = function (points) {
        context.beginPath();
        points.forEach(function (item, i) {
            if (i == 0) context.moveTo(item.x, item.y);
            else context.lineTo(item.x, item.y);
        });
        context.stroke();
        context.closePath();
    };

    this.drawBezierCurve = function (points)  {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        context.stroke();
        context.closePath();
    };
}
