document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* ===== 設定 ===== */
  const VISIBLE = 4.5;        // 中央±何枚見せるか
  const ARC = Math.PI;        // 半円（180°）
  const RADIUS_X = 300;
  const RADIUS_Z = 520;
  const BASE_Z = -420;

  const SCALE_GAIN = 0.22;
  const DAMPING = 0.88;
  const SNAP = 0.18;

  let current = 1;            // 表示中インデックス
  let offset = 0;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {
  slides.forEach((slide, i) => {

    // ★ 無限ループ用：循環距離
    let d = i - current + offset;
    d = ((d + total / 2) % total) - total / 2;

    // 半円外は非表示
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
      offset += velocity;
      velocity *= DAMPING;

      if (Math.abs(velocity) < 0.001) {
        const snap = Math.round(offset);
        offset += (snap - offset) * SNAP;
        velocity = 0;

        if (Math.abs(offset) > 0.5) {
          current -= snap;
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
    offset += dx * 0.005;
    velocity = dx * 0.005;

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
