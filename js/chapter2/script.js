const cylinder = document.getElementById("cylinder");
const outers = document.querySelectorAll(".panel.outer");
const inners = document.querySelectorAll(".panel.inner");

let dragging = false;
let lastX = 0;
let velocity = 0;

/* 回転 */
let rotationY = 0;        // 手前（外側）
let innerRotationY = 0;   // 奥（内側・逆方向用）

/* カメラ */
let cameraZ = 300;
const targetZ = -180;

/* 定数 */
const DAMPING = 0.92;
const SNAP = 72;

/* 入場演出 */
let intro = true;
setTimeout(() => intro = false, 1200);

/* =========================
   入力
========================= */
const start = x => {
  dragging = true;
  lastX = x;
  velocity = 0;
};

const move = x => {
  if (!dragging) return;

  const dx = x - lastX;

  /* 手前はそのまま */
  rotationY += dx * 0.3;

  /* ★ 奥は逆方向・少し弱く */
  innerRotationY -= dx * 0.15;

  velocity = dx * 0.3;
  lastX = x;
};

const end = () => {
  dragging = false;

  const target = Math.round(rotationY / SNAP) * SNAP;
  velocity = (target - rotationY) * 0.15;
};

/* =========================
   アニメーション
========================= */
function animate() {
  /* カメラ入場 */
  if (intro) {
    cameraZ += (targetZ - cameraZ) * 0.05;
  }

  /* 慣性 */
  if (!dragging) {
    rotationY += velocity;
    velocity *= DAMPING;
    if (Math.abs(velocity) < 0.01) velocity = 0;
  }

  /* 円筒本体（手前基準） */
  cylinder.style.transform =
    `translateZ(${cameraZ}px) rotateX(-22deg) rotateY(${rotationY}deg)`;

  /* =========================
     外側（手前）
  ========================= */
  outers.forEach(panel => {
    const i = Number(panel.style.getPropertyValue("--i"));
    const angle = (rotationY + i * 72) * Math.PI / 180;

    const light = Math.max(0.15, Math.cos(angle) * 0.85);
    panel.style.filter = `brightness(${light})`;
  });

  /* =========================
     内側（奥・逆方向・円弧）
  ========================= */
  inners.forEach(panel => {
    const i = Number(panel.style.getPropertyValue("--i"));

    const angleDeg = innerRotationY + i * 72;
    const angleRad = angleDeg * Math.PI / 180;

    /* 中央度（1=中央, 0=左右） */
    const frontness = Math.max(0, Math.cos(angleRad));

    /* ★ 中央ほど少し小さく */
    const scale = 0.9 - frontness * 0.12;

    panel.style.transform = `
      rotateY(${angleDeg}deg)
      translateZ(-300px)
      rotateY(180deg)
      scale(${scale})
    `;

    /* 奥用ライティング */
    const light = 0.35 + frontness * 0.6;
    panel.style.filter = `brightness(${light})`;
  });

  requestAnimationFrame(animate);
}

animate();

/* =========================
   イベント
========================= */
window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
window.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
window.addEventListener("touchend", end);

