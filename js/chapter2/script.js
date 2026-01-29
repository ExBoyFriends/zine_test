document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  const total = slides.length;
  if (!total) return;

  let current = 0;
  let startX = 0;

  function render() {
    slides.forEach((slide, i) => {
      let d = i - current;

      if (d > total / 2) d -= total;
      if (d < -total / 2) d += total;

      /* 中央 */
      if (d === 0) {
        slide.style.transform = `
          translate(-50%, -50%)
          translateZ(-200px)
        `;
        slide.style.opacity = 1;
        slide.style.zIndex = 3;
      }

      /* 左 */
      else if (d === -1) {
        slide.style.transform = `
          translate(-50%, -50%)
          translateX(-40vw)
          rotateY(40deg)
          translateZ(-400px)
        `;
        slide.style.opacity = 0.8;
        slide.style.zIndex = 2;
      }

      /* 右 */
      else if (d === 1) {
        slide.style.transform = `
          translate(-50%, -50%)
          translateX(40vw)
          rotateY(-40deg)
          translateZ(-400px)
        `;
        slide.style.opacity = 0.8;
        slide.style.zIndex = 2;
      }

      /* 非表示 */
      else {
        slide.style.opacity = 0;
        slide.style.zIndex = 1;
      }
    });
  }

  render();

  /* スワイプ */
  window.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 30) {
      current = dx < 0
        ? (current + 1) % total
        : (current - 1 + total) % total;
      render();
    }
  });

  /* マウス（PC確認用） */
  window.addEventListener("mousedown", e => {
    startX = e.clientX;
  });

  window.addEventListener("mouseup", e => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 30) {
      current = dx < 0
        ? (current + 1) % total
        : (current - 1 + total) % total;
      render();
    }
  });

});


