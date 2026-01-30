document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* ===== 設定 ===== */
  const ARC = Math.PI;              // 半円
  const VISIBLE = 3;                // 表示範囲（密に）
  const RADIUS_X = 280;
  const RADIUS_Z = 520;
  const BASE_Z = -420;

  const SCALE_GAIN = 0.15;
  const DAMPING = 0.9;
  const SNAP = 0.2;

  let index = 0;
  let offset = 0;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {
    slides.forEach((slide, i) => {

      // 無限ループ距離
      let d = i - index + offset;
      d = ((d + total / 2) % total) - total / 2;

      if (Math.abs(d) > VISIBLE) {
        slide.style.opacity = 0;
        return;
      }
      slide.style.opacity = 1;

      const t = d / VISIBLE;
      const a = t * (ARC / 2);

      const x = Math.sin(a) * RADIUS_X;
      const z = Math.cos(a) * RADIUS_Z + BASE_Z;

      // ★ 円の中心を向く（最重要）
      const rotateY = (a * 180 / Math.PI) + 90;

      const scale = 1 + Math.abs(t) * SCALE_GAIN;

      slide.style.transform = `
        translate(-50%, -50%)
        translate3d(${x}px, 0, ${z}px)
        rotateY(${rotateY}deg)
        scale(${scale})
      `;

      slide.style.zIndex = 1000 - Math.abs(d) * 100;
    });
  }

  function animate() {
    if (!dragging) {
      offset += velocity;
      velocity *= DAMPING;

      if (Math.abs(velocity) < 0.001) {
        const snap = Math.round(offset);
        offset += (snap - offset) * SNAP;

        if (Math.abs(offset) > 0.5) {
          index = (index - snap + total) % total;
          offset = 0;
        }
      }
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

    // ★ ドラッグ方向＝移動方向
    offset += dx * 0.004;
    velocity = dx * 0.004;

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
