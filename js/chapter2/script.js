const cylinder = document.getElementById("cylinder");
const outers = document.querySelectorAll(".panel.outer");
const inners = document.querySelectorAll(".panel.inner");

let dragging = false;
let lastX = 0;
let velocity = 0;

let rotationY = 0;
let innerRotationY = 0;

let cameraZ = 320;
const targetZ = -160;

const DAMPING = 0.92;
const SNAP = 72;

let intro = true;
setTimeout(() => intro = false, 1200);

const start = x => {
  dragging = true;
  lastX = x;
  velocity = 0;
};

const move = x => {
  if (!dragging) return;

  const dx = x - lastX;
  rotationY += dx * 0.3;
  innerRotationY -= dx * 0.18;
  velocity = dx * 0.3;
  lastX = x;
};

const end = () => {
  dragging = false;
  const target = Math.round(rotationY / SNAP) * SNAP;
  velocity = (target - rotationY) * 0.14;
};

function animate() {

  if (intro) {
    cameraZ += (targetZ - cameraZ) * 0.05;
  }

  if (!dragging) {
    rotationY += velocity;
    velocity *= DAMPING;
  }

  cylinder.style.transform =
    `translateZ(${cameraZ}px) rotateX(-22deg) rotateY(${rotationY}deg)`;

  /* 手前 */
  outers.forEach(panel => {
    const i = +panel.style.getPropertyValue("--i");
    const rad = (rotationY + i * 72) * Math.PI / 180;
    panel.style.filter =
      `brightness(${0.35 + Math.cos(rad) * 0.5})`;
  });

  /* 奥（逆回転＋円弧） */
  inners.forEach(panel => {
    const i = +panel.style.getPropertyValue("--i");

    const deg = innerRotationY + i * 72;
    const rad = deg * Math.PI / 180;
    const center = Math.max(0, Math.cos(rad));

    const scale = 0.92 - center * 0.18;
    const z = -260 - center * 40;

    panel.style.transform = `
      rotateY(${deg}deg)
      translateZ(${z}px)
      rotateY(180deg)
      scale(${scale})
    `;

    panel.style.filter =
      `brightness(${0.35 + center * 0.5})`;
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX));
window.addEventListener("touchmove", e => move(e.touches[0].clientX));
window.addEventListener("touchend", end);

