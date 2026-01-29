document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;
  if (!total) return;

  let current = 0;
  let startX = 0;

  /* 円形パラメータ（ここが世界観の心臓） */
  const RADIUS_X = 22;   // 横方向の広がり（vw）
  const RADIUS_Z = 420;  // 奥行き
  const ROTATE = 60;     // 回転量
  const SIDE_OPACITY = 0.35;

  function rel(i) {
    let d = i - current;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function render() {
    slides.forEach((slide, i) => {
      const d = rel(i);

      /* 角度（円運動） */
      const angle = (d / total) * Math.PI * 2;

      const x = Math.sin(angle) * RADIUS_X;
      const z = Math.cos(angle) * -RADIUS_Z;
      const r = -Math.sin(angle) * ROTATE;
      const s = d === 0 ? 1.08 : 0.9;
      const o = d === 0 ? 1 : SIDE_OPACITY;

      slide.style.setProperty("--x", `${x}vw`);
      slide.style.setProperty("--z", `${z}px`);
      slide.style.setProperty("--r", `${r}deg`);
      slide.style.setProperty("--s", s);
      slide.style.setProperty("--o", o);

      slide.style.zIndex = 100 - Math.abs(d);
    });
  }

  render();

  /* スワイプ */
  window.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      current = dx < 0
        ? (current + 1) % total
        : (current - 1 + total) % total;
      render();
    }
  });

  /* マウス */
  window.addEventListener("mousedown", e => startX = e.clientX);
  window.addEventListener("mouseup", e => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) {
      current = dx < 0
        ? (current + 1) % total
        : (current - 1 + total) % total;
      render();
    }
  });

});
