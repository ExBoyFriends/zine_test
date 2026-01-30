const cylinder = document.getElementById("cylinder");
const outers = document.querySelectorAll(".panel.outer");
const inners = document.querySelectorAll(".panel.inner");

let dragging = false;
let lastX = 0;
let velocity = 0;
let rotationY = 0;

const DAMPING = 0.92;
const SNAP = 72;

const start = x => {
  dragging = true;
  lastX = x;
  velocity = 0;
};

const move = x => {
  if (!dragging) return;
  const dx = x - lastX;
  rotationY += dx * 0.3;
  velocity = dx * 0.3;
  lastX = x;
};

const end = () => {
  dragging = false;
  const target = Math.round(rotationY / SNAP) * SNAP;
  velocity = (target - rotationY) * 0.15;
};

function animate() {
  if (!dragging) {
    rotationY += velocity;
    velocity *= DAMPING;
    if (Math.abs(velocity) < 0.01) velocity = 0;
  }

  cylinder.style.transform =
    `translateZ(300px) rotateX(-22deg) rotateY(${rotationY}deg)`;

  outers.forEach(panel => {
    const i = Number(panel.style.getPropertyValue("--i"));
    const angle = (rotationY + i * 72) * Math.PI / 180;
    const light = Math.max(0.15, Math.cos(angle) * 0.85);
    panel.style.filter = `brightness(${light})`;
  });

  inners.forEach(panel => {
    const i = Number(panel.style.getPropertyValue("--i"));
    const angle = (rotationY + i * 72 + 180) * Math.PI / 180;
    const light = Math.max(0.25, Math.cos(angle) * 0.9);
    panel.style.filter = `brightness(${light})`;
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
window.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
window.addEventListener("touchend", end);


