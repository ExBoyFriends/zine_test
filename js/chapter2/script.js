document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* ===== パラメータ ===== */
  const STEP = (Math.PI * 2) / total;
  const RADIUS_X = 240;
  const RADIUS_Z = 620;
  const DEPTH_OFFSET = -260;
  const TILT = 72;
  const SCALE_GAIN = 0.12;
  const DAMPING = 0.92;
  const SNAP = 0.14;

  /* 初期：2枚目が正面 */
  let angle = STEP * 1;

  let velocity = 0;
  let dragging = false;
  let lastX = 0;

function render() {
  const centerIndex = Math.round(angle / STEP);

  slides.forEach((slide, i) => {

    const offset = i - centerIndex;
    const a = offset * STEP - (angle % STEP);

    const x = Math.sin(a) * RADIUS_X;
    const z = Math.cos(a) * RADIUS_Z + DEPTH_OFFSET;

    const r = -offset * TILT;
    const s = 1 + Math.abs(Math.sin(a)) * SCALE_GAIN;

    slide.style.transform = `
      translate(-50%, -50%)
      translate3d(${x}px, 0px, ${z}px)
      rotateY(${r}deg)
      scale(${s})
    `;

    slide.style.zIndex = 1000 - Math.abs(offset) * 100;
  });
}


  function animate() {
    if (!dragging) {
      angle += velocity;
      velocity *= DAMPING;

      if (Math.abs(velocity) < 0.002) {
        const target = Math.round(angle / STEP) * STEP;
        angle += (target - angle) * SNAP;
        velocity = 0;
      }
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
    angle -= dx * 0.003;
    velocity = -dx * 0.003;
    lastX = e.clientX;
  });

  window.addEventListener("mouseup", () => dragging = false);

  /* ===== タッチ ===== */
  window.addEventListener("touchstart", e => {
    dragging = true;
    lastX = e.touches[0].clientX;
    velocity = 0;
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - lastX;
    angle -= dx * 0.003;
    velocity = -dx * 0.003;
    lastX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", () => dragging = false);
});

