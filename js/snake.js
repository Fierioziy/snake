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
            if (!last) return 0;
            if (this.collides(foodLoc)) {
                this.segments.push(last);
                var succ = generateFood();
                if (!succ) return 2;
            }
            
            return 1;
        },
        
        move() {
            var dir = new Point(0, 0).clone(keyState.queue.getDir());
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
            
            for (var i = 1; i < this.segments.length; i++) {
                if (this.collides(this.segments[i])) return false;
            }
                        
            return last;
        },
        
        collides(p) {
            return this.segments[0].equals(p);
        },
        
        reset() {
            this.segments = [new Point(2, 0), new Point(1, 0), new Point(0, 0)];
        }
    };

function renderMap() {
    var r = new Rect(0, 0, 1, 1);
    var p = new Point(0, 0);
    
    renderPoint(p, r, snake.segments[0], "white");
    
    for (var i = 1; i < snake.segments.length; i++) {
        var el = snake.segments[i];
        var middle = snake.segments[i - 1].getMiddle(el);
        
        renderPoint(p, r, middle, "white");
        
        renderPoint(p, r, el, "white");
    }
    
    // Jedzonko
//    renderPoint(p, r, foodLoc, "green");
    var c = new Circle((foodLoc.x + 0.5) * screenSize.prop,
                       (foodLoc.y + 0.5) * screenSize.prop,
                       0.3 * screenSize.prop);
    c.draw("green");
    
    // Głowa
    renderPoint(p, r, snake.segments[0], "#00649b");
}

function renderPoint(p, r, target, color) {
    var off = 0.1;
    p.clone(target).add(0.1, 0.1).toRender();
    r.transform(p, (1 - 2*off) * screenSize.prop, (1 - 2*off) * screenSize.prop);
    r.draw(color);
}

function onStart() {
    generateFood();
}

function onUpdate() {
    var success = snake.onUpdate();
    renderMap();
    switch (success) {
        case 0: {
            triggerGameOver();
            break;
        }
        case 2: {
            triggerWin();
            break;
        }
    }
}

function generateFood() {
    var locs = generatePossibilities();
    
    snake.segments.forEach(function (el) {
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
    
    if (locs.length == 0) return false;
    
    var value = locs[Math.floor(Math.random() * locs.length)];
    
    foodLoc.set(value % mapSize, Math.floor(value / mapSize));
    return true;
}

function generatePossibilities() {
    var locs = new Array(mapSize * mapSize);
    for (var i = 0; i < locs.length; ++i) {
        locs[i] = i;
    }
    return locs;
}

function triggerWin() {
    gameState = "won";
}

function triggerGameOver() {
    gameState = "gameOver";
}