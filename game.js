const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Bullet {
    constructor(x, y, size, color, speed, angle) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
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
        this.draw();
    }
}

class Enemy {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
        this.draw();
    }
}

class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = 5;
        this.dx = 0;
        this.dy = 0;
        this.bullets = [];
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
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
                this.bullets.splice(index, 1);
            }
        });
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

    shoot(angle) {
        const bullet = new Bullet(this.x, this.y, 5, 'yellow', 10, angle);
        this.bullets.push(bullet);
    }
}

const player = new Player(canvas.width / 2, canvas.height / 2, 20, 'white');
const enemies = [];
const spawnInterval = 1000;

function spawnEnemy() {
    const size = 20;
    const x = Math.random() < 0.5 ? 0 - size : canvas.width + size;
    const y = Math.random() < 0.5 ? 0 - size : canvas.height + size;
    const speed = 2;
    const enemy = new Enemy(x, y, size, 'red', speed);
    enemies.push(enemy);
}

function handleCollision() {
    player.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (dist - bullet.size - enemy.size < 1) {
                enemies.splice(enemyIndex, 1);
                player.bullets.splice(bulletIndex, 1);
            }
        });
    });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemies.forEach(enemy => enemy.update());
    handleCollision();
    requestAnimationFrame(updateGame);
}

function keyDownHandler(e) {
    player.move(e.key);
}

function keyUpHandler(e) {
    player.stop(e.key);
}

function mouseDownHandler(e) {
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    player.shoot(angle);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousedown', mouseDownHandler);

setInterval(spawnEnemy, spawnInterval);
updateGame();
