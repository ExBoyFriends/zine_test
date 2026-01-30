import { initLoader } from "./loader.js";

/* ======================
   loader
====================== */
const loader = document.getElementById("loader");
initLoader(loader);

/* ======================
   要素取得
====================== */
const front = document.querySelector(".cylinder-front");
const back  = document.querySelector(".cylinder-back");

const outers = document.querySelectorAll(".outer");
const inners = document.querySelectorAll(".inner");

/* ======================
   定数（← ここが正しい場所）
====================== */
const COUNT = outers.length;     // パネル枚数
const SNAP  = 360 / COUNT;       // 円を必ず閉じる

const R_FRONT = 185;             // 手前半径（狭め）
const R_BACK  = 170;             // 奥半径（少し内側）

const AUTO_SPEED = -0.2; // ★ マイナス＝右→左（超ゆっくり）

const DAMPING = 0.85;

/* ======================
   状態
====================== */
let dragging = false;
let lastX = 0;
let velocity = 0;
let angle = 0;

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
  velocity = dx * 0.15;
  lastX = x;
};

const end = () => {
  dragging = false;
  const target = Math.round(angle / SNAP) * SNAP;
  velocity = (target - angle) * 0.1;
};

/* ======================
   初期配置
====================== */
outers.forEach((p, i) => {
  p.dataset.base = i * SNAP;
});

inners.forEach((p, i) => {
  p.dataset.base = i * SNAP;
});

/* ======================
   アニメーション
====================== */
function animate() {

 if (!dragging) {
  angle += velocity;
  velocity *= DAMPING;
  if (Math.abs(velocity) < 0.01) velocity = 0;

  // ★ 慣性が完全に止まったら自動回転
  if (velocity === 0) {
    angle += AUTO_SPEED;
  }
}


  /* ---------- 円柱 ---------- */
  front.style.transform =
    `rotateX(-22deg) rotateY(${angle}deg)`;

  back.style.transform =
    `rotateX(-22deg) rotateY(${angle}deg)`;

  /* ---------- 手前パネル ---------- */
  outers.forEach(p => {
    const base = +p.dataset.base;
    p.style.transform = `
      rotateY(${base}deg)
      translateZ(${R_FRONT}px)
    `;
  });

  /* ---------- 奥パネル（裏側・同一円弧） ---------- */
  inners.forEach(p => {
    const base = +p.dataset.base;
    p.style.transform = `
      translateY(-20px)
      rotateY(${base + 180}deg)
      translateZ(${R_BACK}px)
      rotateY(180deg)
      scale(0.97)
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

window.addEventListener(
  "touchstart",
  e => start(e.touches[0].clientX),
  { passive: true }
);

window.addEventListener(
  "touchmove",
  e => move(e.touches[0].clientX),
  { passive: true }
);

window.addEventListener("touchend", end);

