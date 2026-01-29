document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* === チューニング用パラメータ === */
  const GAP = 120;        // 横の間隔
  const RADIUS = 800;     // 円の半径（大きいほど緩やか）
  const DEPTH = 260;      // Z方向の振れ幅
  const TILT = 26;        // 内向き傾き
  const DAMPING = 0.92;   // 慣性減衰

  let pos = 0;            // 無限位置
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {
    slides.forEach((slide, i) => {

      let d = i * GAP - pos;
      const wrap = total * GAP;

      /* 完全無限ラップ */
      d = ((d % wrap) + wrap) % wrap;
      if (d > wrap / 2) d -= wrap;

      const angle = d / RADIUS;

      /* ===== 円弧表現の核心 ===== */
      const x = d;
      const z = Math.cos(angle) * DEPTH + 80;          // ← 両端が手前に来る
      const r = -Math.sin(angle) * TILT * 1.3;         // ← 内向きに倒れる
      const s = 1 + Math.abs(Math.sin(angle)) * 0.08;  // ← 端が少し大きい

      slide.style.transform = `
        translate3d(${x}px, -50%, ${z}px)
        rotateY(${r}deg)
        scale(${s})
      `;

      slide.style.zIndex = 1000 - Math.abs(d);
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

  animate();

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


