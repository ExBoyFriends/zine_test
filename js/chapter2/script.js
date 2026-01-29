document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  let position = 0;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  /* 超軽量パラメータ */
  const DRAG = 0.0035;     // 指追従（かなり強め）
  const FRICTION = 0.985;  // すーっと止まる
  const GAP = 22;          // 重なり最小
  const ROT = 18;          // 回転は控えめ
  const SCALE = 0.04;      // 中央強調ほんの少し

  function normalize(d) {
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function render() {
    slides.forEach((slide, i) => {
      const d = normalize(i - position);

      const x = d * GAP;
      const r = -d * ROT;
      const s = 1 + Math.max(0, 1 - Math.abs(d)) * SCALE;

      slide.style.transform = `
        translate(-50%, -50%)
        translateX(${x}vw)
        rotateY(${r}deg)
        scale(${s})
      `;

      slide.style.zIndex = 100 - Math.abs(d);
    });
  }

  function tick() {
    if (!dragging) {
      velocity *= FRICTION;
      if (Math.abs(velocity) < 0.00001) velocity = 0;
      position += velocity;
    }
    render();
    requestAnimationFrame(tick);
  }

  tick();

  /* 操作 */
  function start(x) {
    dragging = true;
    lastX = x;
    velocity = 0;
  }

  function move(x) {
    if (!dragging) return;
    const dx = x - lastX;
    position -= dx * DRAG;   // ← 向き正しい
    lastX = x;
  }

  function end() {
    dragging = false;
  }

  window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
  window.addEventListener("touchmove",  e => move(e.touches[0].clientX),  { passive: true });
  window.addEventListener("touchend",   end);

  window.addEventListener("mousedown", e => start(e.clientX));
  window.addEventListener("mousemove", e => move(e.clientX));
  window.addEventListener("mouseup",   end);

});

