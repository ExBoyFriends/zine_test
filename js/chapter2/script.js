document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* === チューニング用パラメータ === */
  const GAP = 120;        // 横の間隔
  const RADIUS = 800;     // 円の半径
  const DEPTH = 260;      // Z方向の振れ幅
  const TILT = 26;        // 内向き傾き
  const DAMPING = 0.92;   // 慣性減衰

  /* ===== 初期位置 =====
     2枚目（index:1）が中央・最奥に来る */
 let pos = GAP * 1 + GAP * 0.66; // ← ここ微調整

  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {
  slides.forEach((slide, i) => {

    let d = i * GAP - pos;
    const wrap = total * GAP;

    d = ((d % wrap) + wrap) % wrap;
    if (d > wrap / 2) d -= wrap;

    /* ===== 多角柱の核心 ===== */

    const step = GAP;                 // 1面ぶん
    const faceIndex = d / step;       // 何面ズレてるか
    const angleStep = 32;             // ← ★角柱の角度（強め）
    
    const angle = faceIndex * angleStep * Math.PI / 180;

    const x = Math.sin(angle) * RADIUS;
    const z = Math.cos(angle) * RADIUS * -1 + 300;
    const r = -faceIndex * angleStep;
    const s = 1 + Math.abs(faceIndex) * 0.04;

    slide.style.transform = `
      translate3d(${x}px, -50%, ${z}px)
      rotateY(${r}deg)
      scale(${s})
    `;

    slide.style.zIndex = 1000 - Math.abs(faceIndex);
  });
}


  function animate() {
    if (!dragging) {
      pos += velocity;
      velocity *= DAMPING;
      if (Math.abs(velocity) < 0.01) velocity = 0;
    }
    render();
    requestAnimationFrame(animate);
  }

  /* 初期フレーム安定化（iOS対策） */
  requestAnimationFrame(() => {
    render();
    animate();
  });

  /* ===== マウス ===== */
  window.addEventListener("mousedown", e => {
    dragging = true;
    lastX = e.clientX;
    velocity = 0;
  });

  window.addEventListener("mousemove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    pos -= dx;
    velocity = -dx;
    lastX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
  });

  /* ===== タッチ ===== */
  window.addEventListener("touchstart", e => {
    dragging = true;
    lastX = e.touches[0].clientX;
    velocity = 0;
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - lastX;
    pos -= dx;
    velocity = -dx;
    lastX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", () => {
    dragging = false;
  });

});

