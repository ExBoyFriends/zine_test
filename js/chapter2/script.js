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
  let pos = GAP * 1;

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

      /* ===== 円弧カーブ ===== */
      const x = d;
      const z = Math.cos(angle) * DEPTH;          // 中央が奥
      const r = -Math.sin(angle) * TILT;           // 連続した傾き
      const s = 1 + Math.abs(Math.sin(angle)) * 0.08;

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

