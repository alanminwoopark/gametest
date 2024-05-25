const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = 5;
        this.dx = 0;
        this.dy = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Boundary detection
        if (this.x < this.size) this.x = this.size;
        if (this.x > canvas.width - this.size) this.x = canvas.width - this.size;
        if (this.y < this.size) this.y = this.size;
        if (this.y > canvas.height - this.size) this.y = canvas.height - this.size;

        this.draw();
    }

    move(direction) {
        switch (direction) {
            case 'ArrowUp':
                this.dy = -this.speed;
                break;
            case 'ArrowDown':
                this.dy = this.speed;
                break;
            case 'ArrowLeft':
                this.dx = -this.speed;
                break;
            case 'ArrowRight':
                this.dx = this.speed;
                break;
        }
    }

    stop(direction) {
        switch (direction) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.dy = 0;
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                this.dx = 0;
                break;
        }
    }
}

const player = new Player(canvas.width / 2, canvas.height / 2, 20, 'white');

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    requestAnimationFrame(updateGame);
}

function keyDownHandler(e) {
    player.move(e.key);
}

function keyUpHandler(e) {
    player.stop(e.key);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

updateGame();
