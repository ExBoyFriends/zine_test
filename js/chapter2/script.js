document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* ===== パラメータ ===== */
  const STEP = (Math.PI * 2) / total;   // 1面分
  const RADIUS_X = 240;
  const RADIUS_Z = 620;
  const DEPTH_OFFSET = -260;

  const TILT = 72;          // 面ごとの固定角度（多角柱）
  const SCALE_GAIN = 0.04;  // 奥行き感（控えめ）
  const DAMPING = 0.92;
  const SNAP = 0.14;

  /* 初期：2枚目が正面 */
  let angle = STEP * 1;

  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {

    /* ★ 中央に来る面を決定 */
    const centerIndex = Math.round(angle / STEP);
    const localAngle  = angle - centerIndex * STEP;

    slides.forEach((slide, i) => {

      /* ★ 面としての相対位置 */
      const faceOffset = i - centerIndex;

      /* ===== 位置（円弧） ===== */
      const a = faceOffset * STEP - localAngle;

      const x = Math.sin(a) * RADIUS_X;
      const z = Math.cos(a) * RADIUS_Z + DEPTH_OFFSET;

      /* ===== 向き（面ごとに固定） ===== */
      const r = -faceOffset * TILT;

      /* ===== スケール ===== */
      const s = 1 + Math.abs(faceOffset) * SCALE_GAIN;

      slide.style.transform = `
        translate(-50%, -50%)
        translate3d(${x}px, 0px, ${z}px)
        rotateY(${r}deg)
        scale(${s})
      `;

      /* ★ 前後関係は「面番号」で安定 */
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
    angle -= dx * 0.003;
    velocity = -dx * 0.003;
    lastX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", () => {
    dragging = false;
  });

});

