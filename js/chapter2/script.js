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

/* ======================
   入力
====================== */
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

/* ======================
   初期配置（基準角を保存）
====================== */
outers.forEach(p => {
  const i = +p.style.getPropertyValue("--i");
  p.dataset.base = i * 72;
});

inners.forEach(p => {
  const i = +p.style.getPropertyValue("--i");
  p.dataset.base = i * 72;
});

/* ======================
   アニメーション
====================== */
function animate() {

  if (!dragging) {
    angle += velocity;
    velocity *= DAMPING;
    if (Math.abs(velocity) < 0.01) velocity = 0;
  }

  /* ---------- 手前：円柱ごと回す ---------- */
  front.style.transform =
    `rotateX(-22deg) rotateY(${ angle }deg)`;

  /* ---------- 奥：視点だけ共有 ---------- */
  back.style.transform =
    `rotateX(-22deg)`;

  /* ---------- 手前パネル ---------- */
  outers.forEach(p => {
    const base = +p.dataset.base;
    p.style.transform = `
      rotateY(${base}deg)
      translateZ(280px)
    `;
  });

  /* ---------- 奥パネル（反転円弧） ---------- */
  inners.forEach(p => {
  const base = +p.dataset.base;
  const rad  = (base - angle) * Math.PI / 180;

  const R = 220; // 奥円弧の半径
  const x = Math.sin(rad) * R;
  const z = -Math.cos(rad) * R; // 中央で最奥

  p.style.transform = `
    translateX(${x}px)
    translateZ(${z}px)
    rotateY(${base - angle + 180}deg)
    scale(0.6)
  `;
});


  requestAnimationFrame(animate);
}

animate();

/* ======================
   イベント
====================== */
window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
window.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
window.addEventListener("touchend", end);
