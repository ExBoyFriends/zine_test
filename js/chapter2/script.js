document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* ===== 設定 ===== */
  const VISIBLE = 4.5;
  const ARC = Math.PI;
  const RADIUS_X = 300;
  const RADIUS_Z = 520;
  const BASE_Z = -420;

  const SCALE_GAIN = 0.22;
  const DAMPING = 0.9;

  let position = 1;      // ← current+offset を一本化
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function wrap(d) {
    return ((d + total / 2) % total) - total / 2;
  }

  function render() {
    slides.forEach((slide, i) => {

      const d = wrap(i - position);

      if (Math.abs(d) > VISIBLE) {
        slide.style.opacity = 0;
        return;
      }
      slide.style.opacity = 1;

      const t = d / VISIBLE;
      const a = t * (ARC / 2);

      const x = Math.sin(a) * RADIUS_X;
      const z = Math.cos(a) * RADIUS_Z + BASE_Z;

      const rotateY = -a * 180 / Math.PI;
      const scale = 1 + Math.abs(t) * SCALE_GAIN;

      slide.style.transform = `
        translate(-50%, -50%)
        translate3d(${x}px, 0, ${z}px)
        rotateY(${rotateY}deg)
        scale(${scale})
      `;

      slide.style.zIndex = Math.round(1000 - Math.abs(t) * 1000);
    });
  }

  function animate() {
    if (!dragging) {
      position += velocity;
      velocity *= DAMPING;
    }

    render();
    requestAnimationFrame(animate);
  }

  animate();

  /* ===== 入力 ===== */
  const start = x => {
    dragging = true;
    lastX = x;
    velocity = 0;
  };

  const move = x => {
    if (!dragging) return;
    const dx = x - lastX;

    // ← 方向も完全一致
    position -= dx * 0.005;
    velocity = -dx * 0.005;

    lastX = x;
  };

  const end = () => dragging = false;

  window.addEventListener("mousedown", e => start(e.clientX));
  window.addEventListener("mousemove", e => move(e.clientX));
  window.addEventListener("mouseup", end);

  window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
  window.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
  window.addEventListener("touchend", end);
});
