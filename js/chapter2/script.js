document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const total = slides.length;

  const VISIBLE = 4.5;
  const ARC = Math.PI;
  const RADIUS_X = 300;
  const RADIUS_Z = 520;
  const BASE_Z = -420;

  const SCALE_GAIN = 0.22;
  const DAMPING = 0.9;

  let position = 1;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;

  function shortestDistance(i, pos) {
    let d = i - pos;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function render() {
  slides.forEach((slide, i) => {

    const d = wrap(i - position);

    if (Math.abs(d) > VISIBLE) {
      slide.style.opacity = 0;
      return;
    }
    slide.style.opacity = 1;

    // 正規化
    const t = d / VISIBLE;           // -1〜1
    const a = t * (ARC / 2);         // -90°〜+90°

    // 円筒内側の位置
    const x = Math.sin(a) * RADIUS_X;
    const z = Math.cos(a) * RADIUS_Z + BASE_Z;

    // ★ 面は常に円の接線方向を向く
    const rotateY = -a * 180 / Math.PI;

    // ★ 遠近で幅が縮む → 台形に見える
    const perspectiveScale =
      Math.cos(a) * 0.6 + 0.4;       // 端でも0にならない

    const scale =
      perspectiveScale * (1 + Math.abs(t) * SCALE_GAIN);

    slide.style.transform = `
      translate(-50%, -50%)
      translate3d(${x}px, 0, ${z}px)
      rotateY(${rotateY}deg)
      scale(${scale})
    `;

    slide.style.zIndex = Math.round(1000 - Math.abs(d) * 100);
  });
}

  function animate() {
    if (!dragging) {
      position += velocity;
      velocity *= DAMPING;

      // ★ position 自体を常に循環
      position = ((position % total) + total) % total;
    }

    render();
    requestAnimationFrame(animate);
  }

  animate();

  const start = x => {
    dragging = true;
    lastX = x;
    velocity = 0;
  };

  const move = x => {
    if (!dragging) return;
    const dx = x - lastX;

    position -= dx * 0.005;
    velocity = -dx * 0.005;

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
