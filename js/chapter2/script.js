document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* ===== パラメータ ===== */
  const STEP = (Math.PI * 2) / total;
  const RADIUS_X = 240;
  const RADIUS_Z = 620;
  const DEPTH_OFFSET = -260;

  const FACE_TILT = 72;     // 面そのものの角度（多角柱）
  const FOLLOW_TILT = 40;   // ★ スライドに追従する角度量

  const SCALE_GAIN = 0.06;
  const DAMPING = 0.92;
  const SNAP = 0.14;

  let angle = STEP * 1;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {

    const centerIndex = Math.round(angle / STEP);
    const localAngle  = angle - centerIndex * STEP;

    slides.forEach((slide, i) => {

      const faceOffset = i - centerIndex;

      /* ===== 位置 ===== */
      const a = faceOffset * STEP - localAngle;
      const x = Math.sin(a) * RADIUS_X;
      const z = Math.cos(a) * RADIUS_Z + DEPTH_OFFSET;

      /* ===== 向き（ここが肝） ===== */
      const baseRotate   = -faceOffset * FACE_TILT;
      const followRotate = -localAngle * FOLLOW_TILT;
      const r = baseRotate + followRotate;

      const s = 1 + Math.abs(faceOffset) * SCALE_GAIN;

      slide.style.transform = `
        translate(-50%, -50%)
        translate3d(${x}px, 0px, ${z}px)
        rotateY(${r}deg)
        scale(${s})
      `;

      slide.style.zIndex = 1000 - Math.abs(faceOffset) * 100;
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

  /* ===== 入力 ===== */
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

