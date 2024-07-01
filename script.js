const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth * 0.8; 
canvas.height = window.innerHeight * 0.8; 


let birdX = 50;
let birdY = canvas.height / 2;
let birdRadius = 20;
let gravity = 0.6;
let jumpStrength = 10;
let velocity = 0;


let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;
let pipeFrequency = 90;
let pipeColor = '#2e7d32';


let clouds = [];
let cloudSpeed = 0.5;
let cloudFrequency = 300; 


let score = 0;
let gameOver = false;
let gameStarted = false; 


document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            startGame();
        } else if (!gameOver) {
            velocity = -jumpStrength; 
        }
    }
});


function startGame() {
    requestAnimationFrame(draw);
}


function drawBird() {
    ctx.beginPath();
    ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f44336';
    ctx.fill();
    ctx.closePath();
}


function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillStyle = pipeColor;
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].topHeight);
        ctx.fillRect(pipes[i].x, pipes[i].bottomY, pipeWidth, canvas.height - pipes[i].bottomY);
    }
}


function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }
    if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }
}


function generatePipes() {
    if (frameCount % pipeFrequency === 0) {
        let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, topHeight: topHeight, bottomY: topHeight + pipeGap });
    }
}



function drawClouds() {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < clouds.length; i++) {
        
        let radius = clouds[i].radius;
        let x = clouds[i].x;
        let y = clouds[i].y;

        ctx.beginPath();
        ctx.arc(x + radius * 0.5, y, radius, 0, Math.PI * 2);
        ctx.arc(x - radius * 0.5, y - radius * 0.3, radius * 0.8, 0, Math.PI * 2);
        ctx.arc(x + radius * 1, y - radius * 0.1, radius * 0.6, 0, Math.PI * 2);
        ctx.arc(x + radius * 1.5, y - radius * 0.2, radius * 0.7, 0, Math.PI * 2);
        ctx.arc(x + radius * 2, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}



function moveClouds() {
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].x -= cloudSpeed;
    }
    if (clouds.length > 0 && clouds[0].x + clouds[0].radius * 2 < 0) {
        clouds.shift();
    }
}


function generateClouds() {
    if (frameCount % cloudFrequency === 0) {
        let cloudRadius = Math.random() * 30 + 20; 
        let cloudY = Math.random() * (canvas.height / 2); 
        clouds.push({ x: canvas.width, y: cloudY, radius: cloudRadius });
    }
}


function drawBorder() {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}


function checkCollisions() {
    
    let birdTop = birdY - birdRadius;
    let birdBottom = birdY + birdRadius;
    let birdLeft = birdX - birdRadius;
    let birdRight = birdX + birdRadius;

    
    for (let i = 0; i < pipes.length; i++) {
        if (birdRight > pipes[i].x && birdLeft < pipes[i].x + pipeWidth) {
            if (birdTop < pipes[i].topHeight || birdBottom > pipes[i].bottomY) {
                gameOver = true;
            }
        }
    }

    
    if (birdBottom > canvas.height || birdTop < 0) {
        gameOver = true;
    }
}


function update() {
    if (!gameOver) {
        velocity += gravity; 
        birdY += velocity; 

        movePipes();
        generatePipes();
        moveClouds();
        generateClouds();
        checkCollisions();
        score++;
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    drawBorder();

    
    drawClouds();

    
    drawPipes();

    if (gameStarted && !gameOver) {
        
        drawBird();

        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 20, 40);
    }

    if (!gameStarted) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText('Press Space to Start', canvas.width / 2 - 120, canvas.height / 2);
    }

    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '36px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 20);
        ctx.font = '24px Arial';
        ctx.fillText('Press F5 to Restart', canvas.width / 2 - 120, canvas.height / 2 + 20);
    }

    
    frameCount++;

    
    if (gameStarted && !gameOver) {
        update();
    }

    
    if (gameStarted && !gameOver) {
        requestAnimationFrame(draw);
    }
}


let frameCount = 0;
