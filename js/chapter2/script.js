document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;
  if (!total) return;

  let position = 0;
  let velocity = 0;
  let isDragging = false;
  let lastX = 0;

  /* 操作感 */
  const DRAG_POWER = 0.0022;
  const FRICTION   = 0.965;

  /* 見た目 */
  const X_GAP = 30;
  const ROTATE = 26;
  const SCALE_CENTER = 1.08;
  const SCALE_SIDE   = 0.96;
  const VISIBLE_RANGE = 2.2;

  function normalize(d) {
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function render() {
    slides.forEach((slide, i) => {
      let d = normalize(i - position);
      const abs = Math.abs(d);

      if (abs > VISIBLE_RANGE) {
        slide.style.opacity = 0;
        return;
      }

      /* 円弧カーブ */
      const curve = Math.sin(d * 0.6);

      const x = d * X_GAP;
      const r = -curve * ROTATE;
      const s = abs < 0.01
        ? SCALE_CENTER
        : SCALE_SIDE;

      /* フェードアウトを自然に */
      const o = Math.max(0, 1 - abs / VISIBLE_RANGE);

      slide.style.zIndex = 100 - abs * 10;
      slide.style.opacity = o;

      slide.style.transform = `
        translate(-50%, -50%)
        translateX(${x}vw)
        rotateY(${r}deg)
        scale(${s})
      `;
    });
  }

  function update() {
    if (!isDragging) {
      velocity *= FRICTION;
      if (Math.abs(velocity) < 0.00001) velocity = 0;
      position += velocity;
    }
    render();
    requestAnimationFrame(update);
  }

  update();

  /* ===== 操作 ===== */
  function start(x) {
    isDragging = true;
    velocity = 0;
    lastX = x;
  }

  function move(x) {
    if (!isDragging) return;
    const dx = x - lastX;
    position -= dx * DRAG_POWER;   // ← 向き修正
    lastX = x;
  }

  function end() {
    isDragging = false;
  }

  window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
  window.addEventListener("touchmove",  e => move(e.touches[0].clientX),  { passive: true });
  window.addEventListener("touchend",   end);

  window.addEventListener("mousedown", e => start(e.clientX));
  window.addEventListener("mousemove", e => move(e.clientX));
  window.addEventListener("mouseup",   end);

  /* タップで即停止 */
  window.addEventListener("click", () => {
    velocity = 0;
  });

});


  /* タップで即停止 */
  window.addEventListener("click", () => {
    velocity = 0;
  });

});
