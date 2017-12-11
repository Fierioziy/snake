var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    gameState = "start",
    screenSize = {
        x: canvas.width,
        y: canvas.height,
        cx: canvas.width / 2,
        cy: canvas.height / 2,
        prop: canvas.width / mapSize
    },
    keyState = {
        queue: {
            buffer: [new Point(1, 0)],
            getDir() {
                if (this.buffer.length > 1) this.buffer.shift();
                var first = this.buffer[0];
                return first;
            },
            add(p) {
                if (!this.buffer[this.buffer.length - 1].equals(p)) {
                    this.buffer.push(p);
                }
            },
            reset() {
                this.buffer = [new Point(1, 0)];
            }
        },
        spacebar: false,
        prevSpacebar: false,
        reset() {
            this.queue.reset();
            this.spacebar = false;
            this.prevSpacebar = false;
        },
        handleKeyEvent(keyCode, isPressed) {
            switch (keyCode) {
                case 65: {
                    if (isPressed) {
                        this.queue.add(new Point(-1, 0));
                    }
                    break;
                }
                case 68: {
                    if (isPressed) {
                        this.queue.add(new Point(1, 0));
                    }
                    break;
                }
                case 87: {
                    if (isPressed) {
                        this.queue.add(new Point(0, -1));
                    }
                    break;
                }
                case 83: {
                    if (isPressed) {
                        this.queue.add(new Point(0, 1));
                    }
                    break;
                }
                case 32: {
                    this.spacebar = isPressed;
                    break;
                }
            }
        }
    },
    startScreenRect = new Rect(screenSize.cx, screenSize.cy,
                             0.3 * screenSize.x, 0.1 * screenSize.y),
    gameOverRect = new Rect(screenSize.cx, screenSize.cy,
                            0.5 * screenSize.x, 0.1 * screenSize.y),
    gameWinRect = new Rect(screenSize.cx, screenSize.cy,
                            0.5 * screenSize.x, 0.1 * screenSize.y),
    startText = new Text("Press space to start", 0.025 * screenSize.x /*20*/, "#FFFFFF"),
    gameOverText = new Text("Game Over! Press space to play again.", 0.025 * screenSize.x /*20*/, "#FFFFFF"),
    gameWinText = new Text("You won! Press space to play again.", 0.025 * screenSize.x /*20*/, "#000000");

function run() {
    switch (gameState) {
        case "play": {
            clearCanvas();
            onUpdate();
            break;
        }
        case "won": {
            drawWin();
            gameState = "postGameOver";
            break;
        }
        case "gameOver": {
            drawGameOver();
            gameState = "postGameOver";
            break;
        }
        case "postGameOver": {
            if (keyState.spacebar) {
                gameState = "start";
            }
            break;
        }
        default: {
            if (keyState.spacebar && !keyState.prevSpacebar) {
                gameState = "play";
                keyState.reset();
                snake.reset();
                onStart();
            }
            else drawStartScreen();
        }
    }
    keyState.prevSpacebar = keyState.spacebar;
}

function drawStartScreen() {
    clearCanvas();
    startScreenRect.drawCentered("#555555");
    startText.drawCentered(screenSize.cx, screenSize.cy);
}

function drawWin() {
    gameWinRect.drawCentered("#7CC64D");
    gameWinText.drawCentered(screenSize.cx, screenSize.cy);
}

function drawGameOver() {
    gameOverRect.drawCentered("#FF7777");
    gameOverText.drawCentered(screenSize.cx, screenSize.cy);
}

document.onkeydown = function (e) {
    keyState.handleKeyEvent(e.keyCode, true);
}

document.onkeyup = function (e) {
    keyState.handleKeyEvent(e.keyCode, false);
}

setInterval(run, 150);