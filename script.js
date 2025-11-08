const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🖼️ Load your photo
const photo = new Image();
photo.src = "friend.png";

// 🎵 Load sounds
const flapSound = new Audio("flap.mp3");
const hitSound = new Audio("hit.mp3");

let bird = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

let pipes = [];
let score = 0;
let frames = 0;
let gameStarted = false;

// 🐦 Draw photo
function drawBird() {
  ctx.drawImage(photo, bird.x, bird.y, bird.width, bird.height);
}

// 🌳 Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(
      pipe.x,
      canvas.height - pipe.bottom,
      pipe.width,
      pipe.bottom
    );
  }
}

// 🔄 Update pipes
function updatePipes() {
  if (frames % 90 === 0) {
    let top = Math.random() * 200 + 50;
    let gap = 140;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: canvas.height - top - gap
    });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= 2;
    if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
  }
}

// 💥 Check collision
function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      hitSound.play(); // 💥 play hit sound
      resetGame();
    }
  }

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    hitSound.play(); // 💥 play hit sound
    resetGame();
  }
}

function resetGame() {
  alert("Game Over 😭 Score: " + score);
  document.location.reload();
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  updatePipes();
  drawPipes();
  drawBird();
  drawScore();
  checkCollision();

  frames++;
  if (frames % 90 === 0) score++;

  requestAnimationFrame(gameLoop);
}

// 🕹️ Controls
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameLoop();
  }
  bird.velocity = bird.lift;
  flapSound.currentTime = 0; // rewind sound if pressed fast
  flapSound.play(); // 🐦 play flap sound
}

document.addEventListener("keydown", startGame);
document.addEventListener("touchstart", startGame);

// 🖼️ Show message before start
photo.onload = () => {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Press any key to start!", 80, 300);
};
