var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    gameState = "start",
    screenSize = {
        x: canvas.width,
        y: canvas.height,
        cx: canvas.width / 2,
        cy: canvas.height / 2
    },
    keyState = {
        ver: 0,
        hor: 1,
        spacebar: false,
        prevSpacebar: false,
        reset() {
            this.ver = 0;
            this.hor = 1;
            this.spacebar = false;
            this.prevSpacebar = false;
        },
        handleKeyEvent(keyCode, isPressed) {
            switch (keyCode) {
                case 65: {
                    if (isPressed) {
                        this.hor = -1;
                        this.ver = 0;
                    }
                    break;
                }
                case 68: {
                    if (isPressed) {
                        this.hor = 1;
                        this.ver = 0;
                    }
                    break;
                }
                case 87: {
                    if (isPressed) {
                        this.hor = 0;
                        this.ver = -1;
                    }
                    break;
                }
                case 83: {
                    if (isPressed) {
                        this.hor = 0;
                        this.ver = 1;
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
    startText = new Text("Press space to start", 0.025 * screenSize.x /*20*/, "#FFFFFF"),
    gameOverText = new Text("Game Over! Press space to play again.", 0.025 * screenSize.x /*20*/, "#FFFFFF"),
    rectColor = "#AAAAAA";

function run() {
    switch (gameState) {
        case "play": {
            clearCanvas();
            onUpdate();
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