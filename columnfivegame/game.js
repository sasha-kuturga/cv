/* =========================================================
   COLUMN FIVE PRODUCER SNAKE
   Edit these two values before publishing.
   ========================================================= */

const CONTACT_EMAIL = "kuturga.alexandra@gmail.com";
const CONTACT_URL = "https://kuturga.com";  

/* ========================================================= */

const GRID = 16;
const TARGET = 5;
const TICK_MS = 118;

const MILESTONES = [
  "Got the brief from the client",
  "Aligned the team",
  "Turned feedback into direction",
  "Kept it on track",
  "Shipped it"
];

const COLORS = {
  bg: "#f8d9ec",
  ink: "#181518",
  grid: "rgba(24, 21, 24, 0.11)",
  accent: "#ff4427",
  white: "#ffffff"
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startOverlay = document.getElementById("startOverlay");
const toast = document.getElementById("achievementToast");
const scoreText = document.getElementById("scoreText");
const progressFill = document.getElementById("progressFill");
const milestoneItems = [...document.querySelectorAll("#milestoneList li")];

const modalBackdrop = document.getElementById("modalBackdrop");
const modalKicker = document.getElementById("modalKicker");
const modalTitle = document.getElementById("modalTitle");
const modalCopy = document.getElementById("modalCopy");
const retryButton = document.getElementById("retryButton");
const contactButton = document.getElementById("contactButton");
const contactLine = document.getElementById("contactLine");
const modalClose = document.getElementById("modalClose");

let snake = [];
let dots = [];
let direction = { x: 1, y: 0 };
let queuedDirection = { x: 1, y: 0 };
let timer = null;
let started = false;
let gameOver = false;
let collected = 0;
let toastTimer = null;

function setupCanvas() {
  const size = canvas.getBoundingClientRect().width;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function resetGame() {
  stopLoop();

  snake = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
    { x: 5, y: 8 },
    { x: 4, y: 8 }
  ];

  direction = { x: 1, y: 0 };
  queuedDirection = { x: 1, y: 0 };
  dots = [];
  started = false;
  gameOver = false;
  collected = 0;

  for (let i = 0; i < TARGET; i++) {
    dots.push(randomFreeCell());
  }

  updateProgress();
  milestoneItems.forEach(li => li.classList.remove("done"));
  startOverlay.classList.remove("hidden");
  hideToast();
  hideModal();
  draw();
}

function randomFreeCell() {
  let cell;
  do {
    cell = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID)
    };
  } while (
    snake.some(s => s.x === cell.x && s.y === cell.y) ||
    dots.some(d => d.x === cell.x && d.y === cell.y)
  );
  return cell;
}

function startGame() {
  if (started || gameOver) return;
  started = true;
  startOverlay.classList.add("hidden");
  timer = window.setInterval(step, TICK_MS);
}

function stopLoop() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

function step() {
  if (!started || gameOver) return;

  direction = queuedDirection;
  const head = snake[0];
  const next = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  const hitWall =
    next.x < 0 || next.x >= GRID ||
    next.y < 0 || next.y >= GRID;

  const hitSelf = snake.some(segment => segment.x === next.x && segment.y === next.y);

  if (hitWall || hitSelf) {
    failGame(hitWall ? "edge" : "self");
    return;
  }

  snake.unshift(next);

  const dotIndex = dots.findIndex(dot => dot.x === next.x && dot.y === next.y);

  if (dotIndex >= 0) {
    dots.splice(dotIndex, 1);
    collectMilestone();
  } else {
    snake.pop();
  }

  draw();
}

function collectMilestone() {
  collected += 1;
  updateProgress();
  milestoneItems[collected - 1]?.classList.add("done");
  showToast(collected - 1);

  playTone(520 + collected * 70, 0.06);

  if (collected >= TARGET) {
    gameOver = true;
    stopLoop();
    window.setTimeout(winGame, 520);
  }
}

function updateProgress() {
  scoreText.textContent = `${collected} / ${TARGET}`;
  progressFill.style.width = `${(collected / TARGET) * 100}%`;
}

function showToast(index) {
  window.clearTimeout(toastTimer);
  toast.querySelector(".toast-index").textContent =
    `${String(index + 1).padStart(2, "0")} / ${String(TARGET).padStart(2, "0")}`;
  toast.querySelector("strong").textContent = MILESTONES[index];
  toast.classList.add("show");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1300);
}

function hideToast() {
  window.clearTimeout(toastTimer);
  toast.classList.remove("show");
}

function failGame(reason) {
  gameOver = true;
  stopLoop();
  playTone(150, 0.12);

  modalKicker.textContent = "PROJECT STATUS";
  modalTitle.textContent = reason === "edge" ? "Hit the edge." : "Got tangled.";
  modalCopy.textContent =
    "Want another try? Sure. But why spend your time keeping every piece moving when you could hand it to a producer?";

  retryButton.textContent = "Try again";
  configureContactButton();
  showModal();
}

function winGame() {
  playTone(720, 0.08);
  window.setTimeout(() => playTone(880, 0.08), 90);

  modalKicker.textContent = "PROJECT STATUS";
  modalTitle.textContent = "Shipped.";
  modalCopy.textContent =
    "Five milestones, one moving project. This part is usually easier when there’s a producer keeping it all together.";

  retryButton.textContent = "Play again";
  configureContactButton();
  showModal();
}

function configureContactButton() {
  const hasEmail = CONTACT_EMAIL && !CONTACT_EMAIL.includes("YOUR_EMAIL");
  const hasUrl = CONTACT_URL && CONTACT_URL.trim().length > 0;

  if (hasUrl) {
    contactButton.href = CONTACT_URL;
    contactButton.target = "_blank";
    contactButton.rel = "noopener noreferrer";
    contactButton.textContent = "Meet Alexandra";
    contactLine.textContent = hasEmail ? CONTACT_EMAIL : "";
    contactButton.style.display = "inline-flex";
  } else if (hasEmail) {
    contactButton.href = `mailto:${CONTACT_EMAIL}?subject=Producer%20role%20at%20Column%20Five`;
    contactButton.removeAttribute("target");
    contactButton.textContent = "Email Alexandra";
    contactLine.textContent = CONTACT_EMAIL;
    contactButton.style.display = "inline-flex";
  } else {
    contactButton.style.display = "none";
    contactLine.textContent = "kuturga.alexandra@gmail.com";
  }
}

function showModal() {
  modalBackdrop.hidden = false;
  requestAnimationFrame(() => retryButton.focus());
}

function hideModal() {
  modalBackdrop.hidden = true;
}

function setDirection(next) {
  const opposite =
    next.x === -direction.x &&
    next.y === -direction.y;

  if (opposite) return;

  queuedDirection = next;
  if (!started && !gameOver) startGame();
}

function handleKeydown(e) {
  const key = e.key.toLowerCase();

  const map = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 }
  };

  if (map[key]) {
    e.preventDefault();
    setDirection(map[key]);
  }

  if (key === "escape" && !modalBackdrop.hidden) {
    hideModal();
  }
}

function draw() {
  const size = canvas.getBoundingClientRect().width;
  const cell = size / GRID;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, size, size);

  drawGrid(size, cell);
  drawDots(cell);
  drawSnake(cell);
}

function drawGrid(size, cell) {
  ctx.save();
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;

  for (let i = 1; i < GRID; i++) {
    const p = Math.round(i * cell) + 0.5;

    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDots(cell) {
  const inset = cell * 0.31;
  const dotSize = cell - inset * 2;

  ctx.fillStyle = COLORS.accent;
  dots.forEach(dot => {
    const x = dot.x * cell + inset;
    const y = dot.y * cell + inset;
    ctx.fillRect(x, y, dotSize, dotSize);
  });
}

function drawSnake(cell) {
  const inset = Math.max(2, cell * 0.055);
  const segmentSize = cell - inset * 2;

  snake.forEach((segment, index) => {
    const x = segment.x * cell + inset;
    const y = segment.y * cell + inset;

    ctx.fillStyle = COLORS.ink;
    ctx.fillRect(x, y, segmentSize, segmentSize);

    if (index === 0) {
      drawEyes(x, y, segmentSize);
    }
  });
}

function drawEyes(x, y, size) {
  const eye = Math.max(2.4, size * 0.12);
  const padX = size * 0.28;
  const padY = size * 0.34;

  let e1 = { x: x + size - padX, y: y + padY };
  let e2 = { x: x + size - padX, y: y + size - padY };

  if (direction.x < 0) {
    e1 = { x: x + padX, y: y + padY };
    e2 = { x: x + padX, y: y + size - padY };
  } else if (direction.y < 0) {
    e1 = { x: x + padY, y: y + padX };
    e2 = { x: x + size - padY, y: y + padX };
  } else if (direction.y > 0) {
    e1 = { x: x + padY, y: y + size - padX };
    e2 = { x: x + size - padY, y: y + size - padX };
  }

  ctx.fillStyle = COLORS.white;
  ctx.beginPath();
  ctx.arc(e1.x, e1.y, eye, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(e2.x, e2.y, eye, 0, Math.PI * 2);
  ctx.fill();
}

function playTone(frequency, duration) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioCtx();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.035;

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    oscillator.stop(audio.currentTime + duration);
    oscillator.addEventListener("ended", () => audio.close());
  } catch (_) {
    // Sound is optional; game still works if browser blocks audio.
  }
}

retryButton.addEventListener("click", resetGame);
modalClose.addEventListener("click", hideModal);

modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) hideModal();
});

window.addEventListener("keydown", handleKeydown, { passive: false });
window.addEventListener("resize", setupCanvas);

resetGame();
setupCanvas();
