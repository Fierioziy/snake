function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
};
Point.prototype.add = function (x, y) {
    this.x += x;
    this.y += y;
    return this;
};
Point.prototype.multiply = function (m) {
    this.x *= m;
    this.y *= m;
    return this;
};
Point.prototype.addVec = function (p) {
    this.x += p.x;
    this.y += p.y;
    return this;
};
Point.prototype.clone = function (p) {
    this.x = p.x;
    this.y = p.y;
    return this;
};
Point.prototype.equals = function (p) {
    return this.x == p.x && this.y == p.y;
};
Point.prototype.toRender = function () {
    this.x *= screenSize.x / mapSize;
    this.y *= screenSize.y / mapSize;
    return this;
};
Point.prototype.getMiddle = function (p) {
    return new Point((this.x + p.x) / 2, (this.y + p.y) / 2);
};

var speed = 1,
    snakeSize = 16,
    mapSize = 10,
    foodLoc = new Point(0, 0),
    snake = {
        segments: [new Point(2, 0), new Point(1, 0), new Point(0, 0)],
        
        onUpdate() {
            var last = this.move();
            if (!last) return false;
            if (this.collidesWithFood()) {
                this.segments.push(last);
                generateFood();
            }
            
            return true;
        },
        
        move() {
            var dir = new Point(keyState.hor, keyState.ver);
            var p1 = this.segments[0];
            var p2 = this.segments[1];
            var next = new Point(p1.x + dir.x, p1.y + dir.y);
                        
            if (next.equals(p2)) {
                dir.multiply(-1);
                next.set(p1.x + dir.x, p1.y + dir.y);
            }
            
            if (next.x >= mapSize || next.x < 0 || next.y >= mapSize || next.y < 0) {
                return false;
            }
            
            
            var len = this.segments.length;       
            
            var last = new Point(0, 0).clone(this.segments[len - 1]);
            
            for (var i = len - 1; i > 0; i--) {
                this.segments[i].clone(this.segments[i - 1]);
            }
            
            this.segments[0].addVec(dir);
            
            if (this.collidesWithSelf()) return false;
            
            return last;
        },
        
        collidesWithSelf() {
            for (var i = 0; i < this.segments.length; ++i) {
                for (var j = this.segments.length - 1; j > i; --j) {
                    var seg = this.segments[i];
                    var next = this.segments[j];
                    if (seg.equals(next)) return true;
                }
            }
            return false;
        },
        
        collidesWithFood() {
            return this.segments[0].equals(foodLoc);
        },
        
        reset() {
            this.segments = [new Point(2, 0), new Point(1, 0), new Point(0, 0)];
        }
    };

function renderMap() {
    var r = new Rect(0, 0, 1, 1);
    var p = new Point(0, 0);
    var off = 0.1;
    
    p.clone(snake.segments[0]).add(0.1, 0.1).toRender();
    r.transform(p, 0.8 * screenSize.x/mapSize, 0.8 * screenSize.y/mapSize);
    r.draw("white");
    
    for (var i = 1; i < snake.segments.length; i++) {
        var el = snake.segments[i];
        var middle = snake.segments[i - 1].getMiddle(el);
        
        p.clone(middle).add(off, off).toRender();
        r.transform(p, (1 - 2*off) * screenSize.x/mapSize, (1 - 2*off) * screenSize.y/mapSize);
        r.draw("white");
        
        p.clone(el).add(off, off).toRender();
        r.transform(p, (1 - 2*off) * screenSize.x/mapSize, (1 - 2*off) * screenSize.y/mapSize);
        r.draw("white");
    }
    
    // Jedzonko
    p.clone(foodLoc).add(off, off).toRender();
    r.transform(p, (1 - 2*off) * screenSize.x/mapSize, (1 - 2*off) * screenSize.y/mapSize);
    
    r.draw("green");
    
    // Głowa   
    p.clone(snake.segments[0]).add(off, off).toRender();
    r.transform(p, (1 - 2*off) * screenSize.x/mapSize, (1 - 2*off) * screenSize.y/mapSize);
    
    r.draw("#64ff64");
}

function onStart() {
    generateFood();
}

function onUpdate() {
    var success = snake.onUpdate();
    renderMap();
    if (!success) {
        triggerGameOver();
    }
}

function generateFood() {
    var locs = generatePossibilities();
    
    snake.segments.forEach(function (el) {
//        locs.splice(el.x + el.y * mapSize, 1);
        locs[el.x + el.y * mapSize] = -1;
    });
    
    var i = 0;
    var len = locs.length;
    while (i < len) {
        if (locs[i] == -1){
            locs.splice(i, 1);
            len--;
        }
        else i++;
    }
    
    var value = locs[Math.floor(Math.random() * locs.length)];
    
    foodLoc.set(value % mapSize, Math.floor(value / mapSize));
}

function generatePossibilities() {
    var locs = new Array(mapSize * mapSize);
    for (var i = 0; i < locs.length; ++i) {
        locs[i] = i;
    }
    return locs;
}

function triggerGameOver() {
    gameState = "gameOver";
}