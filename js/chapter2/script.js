document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  let current = 0;
  let startX = 0;

  const SPREAD = 28;   // 横の広がり（vw）
  const ROT = 28;      // 回転角
  const SCALE = 0.18;  // 縮小率

  function rel(i) {
    let d = i - current;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function render() {
    slides.forEach((slide, i) => {
      const d = rel(i);

      const x = Math.sin(d * 0.6) * SPREAD;
      const r = -d * ROT;
      const s = 1 - Math.abs(d) * SCALE;
      const o = Math.abs(d) > 2 ? 0 : 1 - Math.abs(d) * 0.25;

      slide.style.transform = `
        translate(-50%, -50%)
        translateX(${x}vw)
        rotateY(${r}deg)
        scale(${s})
      `;

      slide.style.opacity = o;
      slide.style.zIndex = 100 - Math.abs(d);
    });
  }

  render();

  function move(dir) {
    current = (current + dir + total) % total;
    render();
  }

  /* touch */
  window.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
  });

  /* mouse */
  window.addEventListener("mousedown", e => startX = e.clientX);
  window.addEventListener("mouseup", e => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
  });

});
