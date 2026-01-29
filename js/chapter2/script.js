document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* === チューニング用パラメータ === */
  const GAP = 180;        // 横の間隔（重なり防止）
  const RADIUS = 900;     // 円の奥行き
  const DEPTH = 260;      // Z方向の沈み
  const TILT = 26;        // 内向き傾き
  const DAMPING = 0.92;   // 慣性減衰
  const SCALE_MIN = 0.94; // 最小サイズ

  let pos = 0;            // 無限位置（連続値）
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {
  slides.forEach((slide, i) => {

    let d = i * GAP - pos;
    const wrap = total * GAP;

    /* 🔑 完全無限ラップ（左右対称） */
    d = ((d % wrap) + wrap) % wrap;
    if (d > wrap / 2) d -= wrap;

    const angle = d / RADIUS;

    const x = d;
    const z = -Math.abs(Math.cos(angle)) * DEPTH;
    const r = -angle * TILT;
    const s = Math.max(
      SCALE_MIN,
      1 - Math.abs(d) / (wrap * 0.8)
    );

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


