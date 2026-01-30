const cylinder = document.querySelector(".cylinder");
const outers = document.querySelectorAll(".outer");
const inners = document.querySelectorAll(".inner");

let dragging = false;
let lastX = 0;
let velocity = 0;
let angle = 0;

const DAMPING = 0.92;
const SNAP = 72;

/* 入力 */
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

/* アニメーション */
function animate() {

  if (!dragging) {
    angle += velocity;
    velocity *= DAMPING;
    if (Math.abs(velocity) < 0.01) velocity = 0;
  }

  /* ★ 見下ろしアングルは円柱に固定で付与 */
  cylinder.style.transform = `rotateX(-22deg)`;

  /* ===== 手前 ===== */
  outers.forEach(panel => {
    const i = +panel.style.getPropertyValue("--i");
    const deg = angle + i * 72;
    const rad = deg * Math.PI / 180;

    panel.style.transform = `
      rotateY(${deg}deg)
      translateZ(320px)
    `;

    panel.style.filter =
      `brightness(${0.45 + Math.cos(rad) * 0.45})`;
  });

  /* ===== 奥（逆回転・内側） ===== */
  inners.forEach(panel => {
    const i = +panel.style.getPropertyValue("--i");
    const deg = -angle + i * 72;
    const rad = deg * Math.PI / 180;

    const center = Math.max(0, Math.cos(rad));

    /* ★ Zは常に「手前より浅い」 */
    const z = -220 - center * 80;

    /* ★ 中央で少し小さく */
    const scale = 0.78 - center * 0.12;

    panel.style.transform = `
      rotateY(${deg}deg)
      translateZ(${z}px)
      rotateY(180deg)
      scale(${scale})
    `;

    panel.style.filter =
      `brightness(${0.25 + center * 0.5})`;
  });

  requestAnimationFrame(animate);
}

animate();

/* イベント */
window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true })

