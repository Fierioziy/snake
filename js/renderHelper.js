function Rect(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}
Rect.prototype.transform = function (p, sizeX, sizeY) {
    this.x1 = p.x;
    this.y1 = p.y;
    this.x2 = this.x1 + sizeX;
    this.y2 = this.y1 + sizeY;
};
Rect.prototype.draw = function (color) {
    drawRect(this.x1, this.y1, this.x2, this.y2, color);
};
Rect.prototype.drawCentered = function (color) {
    drawCenteredRect(this.x1, this.y1, this.x2, this.y2, color);
};

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
};
Circle.prototype.draw = function (color) {
    drawCircle(this.x, this.y, this.r, color);
};
Circle.prototype.setCenter = function (x, y) {
    this.x = x;
    this.y = y;
};
Circle.prototype.setRadius = function (r) {
    this.r = r;
};

function Text(s, size, color) {
    this.s = s;
    this.size = size;
    this.color = color;
}
Text.prototype.draw = function (x, y) {
    drawText(this.s, x, y, this.size, this.color);
};
Text.prototype.drawCentered = function (x, y) {
    drawCenteredText(this.s, x, y, this.size, this.color);
};

function drawText(s, x, y, size, color) {
    ctx.beginPath();
    ctx.font = size + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(s, x, y); 
    ctx.closePath();
}

function drawCenteredText(s, x, y, size, color) {
    ctx.font = size + "px Arial";
    var w = getTextWidth(s);
    drawText(s, x - (getTextWidth(s) / 2), y + (size / 4), size, color);
}

function getTextWidth(s) {
    return ctx.measureText(s).width;
}

function drawCenteredRect(x, y, width, height, color) {
    drawRect(x - width/2, y - height/2, x + width/2, y + height/2, color);
}

function drawRect(x1, y1, x2, y2, color) {
    var temp;
    if (x2 < x1) {
        temp = x1;
        x1 = x2;
        x2 = temp;
    }
    if (y2 < y1) {
        temp = y1;
        y1 = y2;
        y2 = temp;
    }
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}