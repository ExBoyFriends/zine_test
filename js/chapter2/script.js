const cylinder = document.getElementById("cylinder");
const outers = document.querySelectorAll(".outer");
const inners = document.querySelectorAll(".inner");

let dragging = false;
let lastX = 0;
let velocity = 0;
let rotationY = 0;

const DAMPING = 0.9;
const SNAP = 72;

/* ===== 入力 ===== */
const start = x => {
  dragging = true;
  lastX = x;
  velocity = 0;
};

const move = x => {
  if (!dragging) return;
  const dx = x - lastX;
  rotationY += dx * 0.35;
  velocity = dx * 0.35;
  lastX = x;
};

const end = () => {
  dragging = false;
  const target = Math.round(rotationY / SNAP) * SNAP;
  velocity = (target - rotationY) * 0.18;
};

/* ===== アニメーション ===== */
function animate() {

  if (!dragging) {
    rotationY += velocity;
    velocity *= DAMPING;
    if (Math.abs(velocity) < 0.01) velocity = 0;
  }

  cylinder.style.transform =
    `rotateX(-22deg) rotateY(${rotationY}deg)`;

  /* ---- 手前：外円柱 ---- */
  outers.forEach(panel => {
    const i = +panel.style.getPropertyValue("--i");
    const deg = rotationY + i * 72;
    const rad = deg * Math.PI / 180;

    panel.style.transform = `
      rotateY(${deg}deg)
      translateZ(320px)
    `;

    panel.style.filter =
      `brightness(${0.45 + Math.cos(rad) * 0.45})`;
  });

  /* ---- 奥：内円柱（逆回転・円弧） ---- */
  inners.forEach(panel => {
    const i = +panel.style.getPropertyValue("--i");
    const deg = -rotationY + i * 72;
    const rad = deg * Math.PI / 180;

    const center = Math.max(0, Math.cos(rad));
    const scale = 0.85 - center * 0.2;
    const z = -260 - center * 140;

    panel.style.transform = `
      rotateY(${deg}deg)
      translateZ(${z}px)
      rotateY(180deg)
      scale(${scale})
    `;

    panel.style.filter =
      `brightness(${0.3 + center * 0.6})`;
  });

  requestAnimationFrame(animate);
}

animate();

/* ===== イベント ===== */
window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
window.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
window.addEventListener("touchend", end);

