const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
const GAME_NAME = 'Space Invaders';
const DEFAULT_PLAYER_COLOR = 'red';

class Bullet {
    constructor(x, y, radius, color, velocity) {
        this.position = {
            x,
            y
        }
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    clearLastFrame() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 1, 0, Math.PI * 2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    update() {
        this.clearLastFrame();
        this.position.y += this.velocity;
        this.draw();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
    }


}

class Player {
    constructor(color = DEFAULT_PLAYER_COLOR) {
        this.position = {
            x: ((innerWidth / 2) - (this.width / 2)),
            y: innerHeight - (innerHeight / 4)
        }
        this.color = color;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.active = true;

        const image = new Image();
        image.src = './img/ship.png';
        image.onload = () => {
            this.image = image;
            this.width = image.width / 4;
            this.height = image.height / 4;
            this.draw();
        }
        canvas.addEventListener('mousemove', (e) => {
            if (!this.active) return;

            this.draw(e);
        })

    }

    draw(e) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x - 2, this.position.y - 2, this.width + 2, this.height + 4);

        this.position.x = Math.min(Math.max(e?.clientX - canvas.offsetLeft - this.width / 2, 100), innerWidth - 100 - this.width);

        if (this.image) ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.draw();
    }

    deactivate() {
        this.active = false;
    }

    shot() {
        console.log('shot')
        if (!this.active) return;
        const bullet = new Bullet(this.position.x + (this.width / 2), this.position.y, 5, 'yellow', -5);
        bullet.draw();
        bullet.animate();
    }
}
class GameName {
    constructor(name = GAME_NAME) {
        this.position = {
            x: 0,
            y: 0
        }
        this.width = innerWidth;
        this.height = innerHeight;
        this.name = name;
        this.active = true;
    }

    draw() {
        if (!this.active) return;
        ctx.fillStyle = 'white';
        ctx.font = '72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name.toUpperCase(), innerWidth / 2, innerHeight / 3.5);
    }

    deactivate() {
        this.active = false;
    }
}

class StartButton {
    constructor() {
        this.position = {
            x: 0,
            y: innerHeight / 3.5
        }
        this.width = innerWidth;
        this.height = innerHeight / 3.5;
        this.name = 'Start Game';
        this.opacity = 1;
        this.opacityDirection = -0.01;
        this.active = true;
    }

    draw(opacity = 1) {
        if (!this.active) return;
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.font = '42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name.toUpperCase(), innerWidth / 2, innerHeight / 2.5);
    }

    breathe() {
        this.opacity += this.opacityDirection;
        this.draw(this.opacity);
        if (this.opacity <= 0 || this.opacity >= 1) {
            this.opacityDirection *= -1;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.breathe();
    }

    deactivate() {
        this.active = false;
    }
}

class StartScreen {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.width = innerWidth;
        this.height = innerHeight;
        this.title = new GameName();
        this.subtitle = new StartButton();
        this.player = new Player();
        this.active = true;
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.title.draw();
        this.subtitle.draw();
        this.subtitle.animate();
        this.player.draw();
    }

    resetBackground() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    deactivate() {
        this.active = false;
        this.subtitle.deactivate();
        this.title.deactivate();
        this.player.deactivate();
        this.resetBackground();
    }


}

const startScreen = new StartScreen();
startScreen.draw();


addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startScreen.deactivate();

    }
})

addEventListener('mousedown', (e) => {
    startScreen.player.shot();
})
