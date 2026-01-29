document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  const ring = document.querySelector(".ring");

  const total = slides.length;
  const radius = 420;          // 円の半径
  let current = 0;
  let startX = 0;

  /* 初期配置：円周上に固定 */
  slides.forEach((slide, i) => {
    const angle = (360 / total) * i;
    slide.style.transform = `
      translate(-50%, -50%)
      rotateY(${angle}deg)
      translateZ(${radius}px)
    `;
  });

  function rotate(dir) {
    current += dir;
    ring.style.setProperty(
      "--rot",
      `${-current * (360 / total)}deg`
    );
  }

  /* タッチ */
  window.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) rotate(dx < 0 ? 1 : -1);
  });

  /* マウス */
  window.addEventListener("mousedown", e => startX = e.clientX);
  window.addEventListener("mouseup", e => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) rotate(dx < 0 ? 1 : -1);
  });

});
