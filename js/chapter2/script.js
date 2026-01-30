document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* === チューニング用パラメータ === */
  const GAP = 90;
  const RADIUS = 700;
  const SPREAD = 0.45;
  const DEPTH = 320;
  const TILT = 42;
  const DAMPING = 0.92;

  /* 初期位置：2枚目が中央・最奥 */
  let pos = GAP * 1.66;

  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {
    slides.forEach((slide, i) => {

      let d = i * GAP - pos;
      const wrap = total * GAP;

      d = ((d % wrap) + wrap) % wrap;
      if (d > wrap / 2) d -= wrap;

      const rawAngle = d / RADIUS;
      const step = Math.PI / 6;
      const angle = Math.round(rawAngle / step) * step;

      const x = Math.sin(angle) * RADIUS * SPREAD;
      const z = Math.cos(angle) * DEPTH * -1 + DEPTH * 0.4;
      const r = -angle * TILT;
      const s = 1 + Math.abs(angle) * 0.12;

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

