document.addEventListener("DOMContentLoaded", () => {

  const slides = [...document.querySelectorAll(".slide")];
  const ring = document.querySelector(".ring");
  const total = slides.length;

  const RADIUS = 420;
  const STEP = 360 / total;

  let current = 0;
  let startX = 0;

  /* 円周上に固定配置 */
  slides.forEach((slide, i) => {
    slide.style.transform = `
      rotateY(${STEP * i}deg)
      translateZ(${RADIUS}px)
    `;
  });

  function rotate(dir) {
    current += dir;
    ring.style.setProperty(
      "--rot",
      `${-current * STEP}deg`
    );
  }

  /* touch */
  window.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) rotate(dx < 0 ? 1 : -1);
  });

  /* mouse */
  window.addEventListener("mousedown", e => startX = e.clientX);
  window.addEventListener("mouseup", e => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) rotate(dx < 0 ? 1 : -1);
  });

});
