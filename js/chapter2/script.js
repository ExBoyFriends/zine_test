document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  /* ===== 設定 ===== */
  const ARC = Math.PI;              // 半円
  const GAP = ARC / 6;              // ← 画像間隔（詰めるなら小さく）
  const RADIUS = 520;
  const BASE_Z = -420;

  const SCALE_GAIN = 0.12;
  const DAMPING = 0.9;
  const SNAP = 0.25;

  let pos = 0;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function render() {
    slides.forEach((slide, i) => {

      // 無限ループ角度
      let a = i * GAP - pos;

      // 正規化（無限）
      const wrap = total * GAP;
      a = ((a % wrap) + wrap) % wrap;
      if (a > wrap / 2) a -= wrap;

      // 半円以外は非表示
      if (Math.abs(a) > ARC / 2) {
        slide.style.opacity = 0;
        return;
      }
      slide.style.opacity = 1;

      const x = Math.sin(a) * RADIUS;
      const z = Math.cos(a) * RADIUS + BASE_Z;

      // ★ 常に円の中心を向く
      const rotateY = a * 180 / Math.PI + 90;

      const scale = 1 + Math.abs(a) * SCALE_GAIN;

      slide.style.transform = `
        translate(-50%, -50%)
        translate3d(${x}px, 0, ${z}px)
        rotateY(${rotateY}deg)
        scale(${scale})
      `;

      slide.style.zIndex = Math.round(1000 - Math.abs(a) * 100);
    });
  }

  function animate() {
    if (!dragging) {
      pos += velocity;
      velocity *= DAMPING;

      if (Math.abs(velocity) < 0.002) {
        const snap = Math.round(pos / GAP) * GAP;
        pos += (snap - pos) * SNAP;
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

    // ★ 方向一致
    pos -= dx * 0.005;
    velocity = -dx * 0.005;

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

    pos -= dx * 0.005;
    velocity = -dx * 0.005;

    lastX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", () => dragging = false);
});
