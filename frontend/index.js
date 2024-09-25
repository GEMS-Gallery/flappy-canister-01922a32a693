import { backend } from 'declarations/backend';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score-value');
const highScoresList = document.getElementById('high-scores-list');

canvas.width = 400;
canvas.height = 600;

const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

const pipes = [];
let score = 0;
let gameLoopId;

const adjectives = ['Happy', 'Silly', 'Clever', 'Brave', 'Mighty', 'Swift', 'Sneaky', 'Daring'];
const nouns = ['Bird', 'Flyer', 'Wing', 'Beak', 'Feather', 'Nest', 'Sky', 'Cloud'];

function generateRandomName() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
}

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#29ABE2';
    ctx.fill();
    ctx.closePath();
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#00A86B';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius > canvas.height) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
    }

    if (bird.y - bird.radius < 0) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const gap = 150;
        const pipeTop = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
        pipes.push({
            x: canvas.width,
            top: pipeTop,
            bottom: canvas.height - pipeTop - gap,
            width: 50,
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipe.width < bird.x && !pipe.passed) {
            score++;
            scoreElement.textContent = score;
            pipe.passed = true;
        }

        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width &&
            (bird.y - bird.radius < pipe.top || bird.y + bird.radius > canvas.height - pipe.bottom)
        ) {
            gameOver();
        }
    });

    pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
}

function update() {
    updateBird();
    updatePipes();
}

function gameLoop() {
    update();
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function startGame() {
    pipes.length = 0;
    score = 0;
    scoreElement.textContent = score;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    gameLoopId = requestAnimationFrame(gameLoop);
}

async function gameOver() {
    cancelAnimationFrame(gameLoopId);
    const playerName = generateRandomName();
    await backend.addHighScore(playerName, score);
    updateHighScores();
}

async function updateHighScores() {
    const highScores = await backend.getHighScores();
    highScoresList.innerHTML = '';
    highScores.forEach(([name, score]) => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${score}`;
        highScoresList.appendChild(li);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.velocity = bird.jump;
    }
});

updateHighScores();
startGame();
