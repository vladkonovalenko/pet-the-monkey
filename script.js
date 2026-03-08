const monkey = document.getElementById("monkey");
const hand = document.getElementById("hand");
const counter = document.getElementById("counter");
const heartsContainer = document.getElementById("hearts");

const idleFrames = ["assets/monkey1.png", "assets/monkey2.png"];
const happyFrames = ["assets/monkey3.png", "assets/monkey4.png"];

let state = "idle";
let frame = 0;
let idleTimer;

let petCount = Number(localStorage.getItem("petCount")) || 0;

counter.innerText = petCount + " ❤️";

let lastPetTime = 0;

/* IDLE */

function startIdle() {
  clearInterval(idleTimer);

  state = "idle";
  frame = 0;

  idleTimer = setInterval(() => {
    frame = (frame + 1) % idleFrames.length;
    monkey.src = idleFrames[frame];
  }, 700);
}

/* HEARTS */

function spawnHearts(big = false, amount = 3) {
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("div");

    heart.className = "heart";

    if (big) heart.classList.add("bonus");

    heart.innerText = "❤️";

    heart.style.left = Math.random() * 60 + 20 + "%";
    heart.style.top = Math.random() * 40 + 30 + "%";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 1500);
  }
}

/* BANANAS */

function spawnBananas(big = false, amount = 6) {
  for (let i = 0; i < amount; i++) {
    const banana = document.createElement("div");

    banana.className = "banana";

    if (big) banana.classList.add("big");

    banana.innerText = "🍌";

    banana.style.left = Math.random() * 60 + 20 + "%";
    banana.style.top = Math.random() * 40 + 30 + "%";

    heartsContainer.appendChild(banana);

    setTimeout(() => banana.remove(), 1500);
  }
}

/* CONFETTI */

function spawnConfetti(amount = 30) {
  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement("div");

    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = "-20px";

    confetti.style.background = `hsl(${Math.random() * 360},80%,60%)`;

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}

/* PET */

function pet() {
  const now = Date.now();

  if (now - lastPetTime < 120) return;

  lastPetTime = now;

  petCount++;

  localStorage.setItem("petCount", petCount);

  counter.innerText = petCount + " ❤️";

  if (petCount % 5 === 0) spawnHearts();

  if ([50, 100, 250].includes(petCount)) {
    spawnHearts(true, 5);
  }

  if (petCount === 200) {
    spawnBananas(false, 6);
  }

  if (petCount === 500) {
    spawnBananas(false, 10);
  }

  if (petCount === 750) {
    spawnBananas(false, 14);
  }

  if (petCount === 1000) {
    spawnBananas(true, 8);
    spawnConfetti();
  }

  if (state === "happy") return;

  clearInterval(idleTimer);

  state = "happy";
  frame = 0;

  const anim = setInterval(() => {
    frame = (frame + 1) % happyFrames.length;
    monkey.src = happyFrames[frame];
  }, 200);

  setTimeout(() => {
    clearInterval(anim);
    startIdle();
  }, 1000);
}

/* HAND */

monkey.addEventListener("mouseenter", () => {
  hand.style.display = "block";
});

monkey.addEventListener("mouseleave", () => {
  hand.style.display = "none";
});

function moveHand(x, y) {
  hand.style.left = `${x}px`;
  hand.style.top = `${y}px`;
}

document.addEventListener("mousemove", (e) => {
  if (hand.style.display === "block") moveHand(e.clientX, e.clientY);
});

document.addEventListener("touchmove", (e) => {
  if (hand.style.display === "block") {
    const touch = e.touches[0];
    moveHand(touch.clientX, touch.clientY);
  }
});

/* EVENTS */

monkey.addEventListener("pointerdown", pet);

monkey.addEventListener("pointermove", (e) => {
  if (e.buttons === 1) pet();
});

monkey.addEventListener("touchmove", pet);

startIdle();
