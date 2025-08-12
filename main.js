// Simple Kaboom.js platformer using only rectangles (no sprites)

kaboom({
  background: [135, 206, 235],
  global: true,
  scale: 1,
});

setGravity(1200);

const MOVE_SPEED = 240;
const JUMP_FORCE = 520;

const COLOR_PLAYER = rgb(34, 34, 34);
const COLOR_GROUND = rgb(46, 204, 113);
const COLOR_PLATFORM = rgb(26, 188, 156);

// High score tracking
const HS_KEY = "kaboom_platformer_highscore_v1";
let highScore = 0;
try {
  const saved = localStorage.getItem(HS_KEY);
  if (saved) {
    const n = Number(saved);
    if (!Number.isNaN(n)) highScore = n;
  }
} catch {}

// Simple audio (Web Audio) sfx
let kbAudioCtx = null;
function ensureAudio() {
  if (!kbAudioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) kbAudioCtx = new Ctx();
  }
}
function playHippie() {
  try {
    ensureAudio();
    if (!kbAudioCtx) return;

    const now = kbAudioCtx.currentTime;

    // Main whoop synth
    const osc = kbAudioCtx.createOscillator();
    const gain = kbAudioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.10);
    osc.frequency.linearRampToValueAtTime(540, now + 0.20);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain).connect(kbAudioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.23);

    // Little sparkle
    const osc2 = kbAudioCtx.createOscillator();
    const gain2 = kbAudioCtx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1100, now + 0.02);
    gain2.gain.setValueAtTime(0.06, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc2.connect(gain2).connect(kbAudioCtx.destination);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.19);
  } catch {}
}

function playGameOverSound() {
  try {
    ensureAudio();
    if (!kbAudioCtx) return;
    const now = kbAudioCtx.currentTime;
    const osc = kbAudioCtx.createOscillator();
    const gain = kbAudioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.6);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain).connect(kbAudioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.66);
  } catch {}
}

function addBlock(posX, posY, width, height, colorValue, isStatic = true) {
  return add([
    pos(posX, posY),
    rect(width, height),
    color(colorValue),
    area(),
    outline(2, rgb(0, 0, 0)),
    isStatic ? body({ isStatic: true }) : body(),
    anchor("topleft"),
  ]);
}

// Ground (extended; tagged as "ground" for collision/game over)
add([
  pos(-2000, 480),
  rect(100000, 48),
  color(COLOR_GROUND),
  area(),
  outline(2, rgb(0, 0, 0)),
  body({ isStatic: true }),
  anchor("topleft"),
  "ground",
]);

// Platforms
const platforms = [];
function addPlatform(x, y, w, h) {
  const p = addBlock(x, y, w, h, COLOR_PLATFORM, true);
  p.platformWidth = w;
  p.counted = false;
  platforms.push(p);
  return p;
}
addPlatform(200, 380, 180, 24);
addPlatform(420, 320, 140, 24);
addPlatform(640, 280, 160, 24);
addPlatform(900, 360, 180, 24);
addPlatform(1150, 300, 220, 24);

// Add more slabs after the first five
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function randRange(min, max) { return min + Math.random() * (max - min); }
(() => {
  let lastX = 1150;
  let lastWidth = 220;
  let lastY = 300;
  let lastRight = lastX + lastWidth;
  const count = 60; // more slabs
  for (let i = 0; i < count; i++) {
    const t = i / count; // difficulty 0..1

    // Base ranges that grow harder as i increases
    let gapBase = 120 + i * 2; // grows slowly
    let gapJitter = randRange(-20, 40);
    let gap = clamp(gapBase + gapJitter, 120, 200);

    let widthBase = 210 - i * 2; // shrinks slowly
    let widthJitter = randRange(-30, 20);
    let width = clamp(widthBase + widthJitter, 100, 240);

    // Occasional easy step
    if ((i + 1) % 6 === 0) {
      gap = randRange(90, 120);
      width = randRange(200, 260);
    }

    // Occasional challenge: smaller and farther but still reachable
    if ((i + 1) % 7 === 0) {
      gap = randRange(170, 200);
      width = randRange(90, 120);
    }

    // Vertical variation increases slightly over time
    const yDeltaMax = Math.round(40 + t * 40); // 40..80
    const yDelta = Math.round(randRange(-yDeltaMax, yDeltaMax));
    const nextY = clamp(lastY + yDelta, 220, 460);

    const nextX = lastRight + gap;
    addPlatform(nextX, nextY, Math.round(width), 24);
    lastX = nextX;
    lastWidth = Math.round(width);
    lastY = nextY;
    lastRight = lastX + lastWidth;
  }
})();

// Player (orange ball)
const player = add([
  pos(100, 100),
  circle(16),
  color(rgb(255, 140, 0)),
  outline(3, rgb(0, 0, 0)),
  area(),
  body(),
  anchor("center"),
]);

// Camera follows player
onUpdate(() => {
  camPos(player.pos);
});

// Movement
let gameOver = false;
onKeyDown("left", () => { if (!gameOver) player.move(-MOVE_SPEED, 0); });
onKeyDown("a", () => { if (!gameOver) player.move(-MOVE_SPEED, 0); });
onKeyDown("right", () => { if (!gameOver) player.move(MOVE_SPEED, 0); });
onKeyDown("d", () => { if (!gameOver) player.move(MOVE_SPEED, 0); });

function tryJump() {
  if (gameOver) return;
  if (player.isGrounded()) {
    player.jump(JUMP_FORCE);
  }
}

onKeyPress("space", tryJump);
onKeyPress("up", tryJump);
onKeyPress("w", tryJump);

// Ensure audio is unlocked on first user interaction
onKeyDown(() => ensureAudio());

// Simple fall reset
player.onUpdate(() => {
  if (player.pos.y > 1200) {
    player.pos = vec2(100, 100);
    player.vel = vec2(0, 0);
  }
});

// Auto-bounce after the first jump
let autoBounceEnabled = false;
let wasGrounded = false;
let landedOnGround = false;
let firstGroundTouchIgnored = false;

function enableAutoBounceOnce() {
  if (!autoBounceEnabled) autoBounceEnabled = true;
}

// When player first jumps manually, enable auto-bounce
onKeyPress("space", enableAutoBounceOnce);
onKeyPress("up", enableAutoBounceOnce);
onKeyPress("w", enableAutoBounceOnce);

// Unified landing detection: handles auto-bounce and ground game-over
onUpdate(() => {
  const grounded = player.isGrounded();
  const justLanded = !wasGrounded && grounded;
  if (justLanded) {
    if (landedOnGround) {
      if (!firstGroundTouchIgnored) {
        firstGroundTouchIgnored = true;
      } else {
        triggerGameOver();
      }
    } else if (autoBounceEnabled && !gameOver) {
      player.jump(JUMP_FORCE);
    }
    landedOnGround = false;
  }
  wasGrounded = grounded;
});

// Detect landing on ground slabs and trigger game over after the first touch
player.onCollide("ground", () => {
  if (player.vel.y > 0) landedOnGround = true;
});

function triggerGameOver() {
  if (gameOver) return;
  gameOver = true;
  autoBounceEnabled = false;
  playGameOverSound();
  // Overlay
  add([
    fixed(),
    z(200),
    anchor("center"),
    pos(center()),
    rect(420, 200),
    color(rgb(0, 0, 0)),
    opacity(0.6),
    outline(2, rgb(255, 255, 255)),
  ]);
  add([
    fixed(),
    z(201),
    anchor("center"),
    pos(center().add(0, -20)),
    text("GAME OVER", { size: 36 }),
  ]);
  add([
    fixed(),
    z(201),
    anchor("center"),
    pos(center().add(0, 24)),
    text(`Score: ${score}\nHigh: ${highScore}\nPress R to restart`, { size: 20, align: "center" }),
  ]);
}



// Score HUD and counting when passing platform right edges
let score = 0;
const scoreLabel = add([
  fixed(),
  z(100),
  pos(12, 12),
  text("Score: 0", { size: 16 }),
  color(rgb(0, 0, 0)),
]);
const highLabel = add([
  fixed(),
  z(100),
  anchor("topright"),
  pos(width() - 12, 12),
  text(`High: ${highScore}`, { size: 14 }),
  color(rgb(255, 0, 0)),
]);
onResize(() => {
  highLabel.pos = vec2(width() - 12, 12);
});

// Title: Slab Dash (big, bold-ish with red outline and blue fill)
const titleLabel = add([
  fixed(),
  z(100),
  anchor("top"),
  pos(width() / 2, 8),
  text("SLAB DASH", { size: 48 }),
  color(rgb(255, 0, 0)), // red fill
  outline(4, rgb(255, 0, 0)), // red outline
]);
onResize(() => {
  titleLabel.pos = vec2(width() / 2, 8);
});

onUpdate(() => {
  if (gameOver) return;
  for (const plat of platforms) {
    const rightEdgeX = plat.pos.x + (plat.platformWidth || 0);
    if (!plat.counted && player.pos.x > rightEdgeX) {
      plat.counted = true;
      score += 1;
      scoreLabel.text = `Score: ${score}`;
      if (score > highScore) {
        highScore = score;
        try { localStorage.setItem(HS_KEY, String(highScore)); } catch {}
        highLabel.text = `High: ${highScore}`;
      }
      playHippie();
    }
  }
});
// Instructions
add([
  fixed(),
  z(100),
  pos(12, 36),
  text("Arrow Keys / A D to move\nW / Up / Space to jump", { size: 16 }),
  color(rgb(0, 0, 0)),
]);

// Restart on R when game over
onKeyPress("r", () => { if (gameOver) location.reload(); });


