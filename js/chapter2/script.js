document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  let pos = 0;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  const GAP = 22;        // 横間隔（vw）
  const DRAG = 0.004;    // 指追従
  const FRICTION = 0.96; // 減速
  const ROT = 14;        // 傾き
  const SCALE = 0.06;    // 中央強調

  function wrap(n) {
    const r = n % total;
    return r < 0 ? r + total : r;
  }

  function render() {
    slides.forEach((slide, i) => {
      let d = i - pos;
      d = ((d + total / 2) % total) - total / 2;

      const x = d * GAP;
      const r = -d * ROT;
      const s = 1 + Math.max(0, 1 - Math.abs(d)) * SCALE;

      slide.style.transform = `
        translateX(${x}vw)
        rotateY(${r}deg)
        scale(${s})
      `;

      slide.style.zIndex = 100 - Math.abs(d);
    });
  }

  function loop() {
    if (!dragging) {
      velocity *= FRICTION;
      if (Math.abs(velocity) < 0.00001) velocity = 0;
      pos += velocity;
    }
    render();
    requestAnimationFrame(loop);
  }

  loop();

  /* 操作 */
  function start(x) {
    dragging = true;
    lastX = x;
  }

  function move(x) {
    if (!dragging) return;
    const dx = x - lastX;
    pos -= dx * DRAG;
    velocity = -dx * DRAG;
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


