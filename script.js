// --- Configurable tuning values (edit these)
const GRAVITY = 0.34;      // lower = slower falling
const LIFT = -6.5;         // smaller magnitude = softer jump
const FLAP_DAMPING = 0.92; // velocity damping for smoother motion (0.9-0.98)
const MAX_FALL_SPEED = 8;  // cap maximum downward speed
const PIPE_SPEED = 1.6;    // pipe horizontal speed (lower = slower obstacles)
const PIPE_SPAWN_FRAMES = 110; // how often pipes spawn (larger = fewer)
const SCORE_INTERVAL = 110; // how many frames per score increment

// Bird object (use these constants)
let bird = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  gravity: GRAVITY,
  lift: LIFT,
  velocity: 0
};

// pipes and game state
let pipes = [];
let score = 0;
let frames = 0;
let gameStarted = false;

// updatePipes uses the PIPE_SPEED and PIPE_SPAWN_FRAMES
function updatePipes() {
  if (frames % PIPE_SPAWN_FRAMES === 0) {
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
    pipes[i].x -= PIPE_SPEED;
    if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
  }
}

// Main game loop: apply damping, cap fall speed
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Physics
  bird.velocity += bird.gravity;
  // apply damping for smoother motion (so rapid velocity spikes feel softer)
  bird.velocity *= FLAP_DAMPING;
  // cap downward speed to avoid very fast falling
  if (bird.velocity > MAX_FALL_SPEED) bird.velocity = MAX_FALL_SPEED;
  bird.y += bird.velocity;

  updatePipes();
  drawPipes();
  drawBird();
  drawScore();
  checkCollision();

  frames++;
  if (frames % SCORE_INTERVAL === 0) score++;

  requestAnimationFrame(gameLoop);
}

// startGame / flap handler: use bird.lift (smaller lift now)
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameLoop();
  }
  bird.velocity = bird.lift;
  // optional: restart sound rewinding if you added sounds
  if (typeof flapSound !== "undefined") {
    flapSound.currentTime = 0;
    flapSound.play();
  }
}
