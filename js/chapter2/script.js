document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;
  if (!total) return;

  /* ===== 物理パラメータ ===== */
  let position = 0;     // 連続回転位置
  let velocity = 0;     // 回転速度
  let isDragging = false;
  let lastX = 0;

  const FRICTION = 0.94;      // 減速（小さいほど止まりやすい）
  const DRAG_POWER = 0.0007; // 指の力
  const MAX_VISIBLE = 1.2;   // 見える範囲

  /* 見た目パラメータ */
  const X_GAP = 24;      // 横間隔（vw）
  const ROTATE = 22;     // 傾き
  const SCALE_GAIN = 0.05;

  function render() {
    slides.forEach((slide, i) => {
      let d = i - position;

      /* 無限ループ補正 */
      if (d > total / 2) d -= total;
      if (d < -total / 2) d += total;

      const abs = Math.abs(d);

      if (abs > MAX_VISIBLE) {
        slide.style.opacity = 0;
        return;
      }

      const x = d * X_GAP;
      const r = -d * ROTATE;
      const s = 1 + abs * SCALE_GAIN;
      const o = 1 - abs * 0.35;

      slide.style.opacity = o;
      slide.style.zIndex = 100 - abs;

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
    velocity = dx * DRAG_POWER;
    position += velocity;
    lastX = x;
  }

  function end() {
    isDragging = false;
  }

  /* タッチ */
  window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
  window.addEventListener("touchmove",  e => move(e.touches[0].clientX),  { passive: true });
  window.addEventListener("touchend",   end);

  /* マウス */
  window.addEventListener("mousedown", e => start(e.clientX));
  window.addEventListener("mousemove", e => move(e.clientX));
  window.addEventListener("mouseup",   end);

  /* タップで即停止 */
  window.addEventListener("click", () => {
    velocity = 0;
  });

});
