const front = document.querySelector(".cylinder-front");
const back  = document.querySelector(".cylinder-back");

const outers = document.querySelectorAll(".outer");
const inners = document.querySelectorAll(".inner");

let dragging = false;
let lastX = 0;
let velocity = 0;
let angle = 0;

const DAMPING = 0.92;
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
  angle += dx * 0.35;
  velocity = dx * 0.35;
  lastX = x;
};

const end = () => {
  dragging = false;
  const target = Math.round(angle / SNAP) * SNAP;
  velocity = (target - angle) * 0.18;
};

/* ===== 初期配置 ===== */
outers.forEach(panel => {
  const i = Number(panel.style.getPropertyValue("--i"));
  panel.style.transform = `
    rotateY(${i * 72}deg)
    translateZ(340px)
  `;
});

inners.forEach(panel => {
  const i = Number(panel.style.getPropertyValue("--i"));
  panel.style.transform = `
    rotateY(${i * 72}deg)
    translateZ(-360px)
    rotateY(180deg)
    scale(0.7)
  `;
});

/* ===== アニメーション ===== */
function animate() {

  if (!dragging) {
    angle += velocity;
    velocity *= DAMPING;
    if (Math.abs(velocity) < 0.01) velocity = 0;
  }

  const transform = `
    rotateX(-22deg)
    rotateY(${angle}deg)
  `;

  front.style.transform = transform;
  back.style.transform  = transform;

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

