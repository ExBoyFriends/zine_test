document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  const total = slides.length;
  if (!total) return;

  let current = 0;
  let startX = 0;

  /* 円形配置 */
 const positions = {
  0:  { x: "0vw",   z: "0px",    r: "0deg",   s: 1.05, o: 1   },

 -1:  { x: "-20vw", z: "-180px", r: "28deg",  s: 0.95, o: 0.65 },
  1:  { x: "20vw",  z: "-180px", r: "-28deg", s: 0.95, o: 0.65 },

 -2:  { x: "-32vw", z: "-380px", r: "55deg",  s: 0.85, o: 0.25 },
  2:  { x: "32vw",  z: "-380px", r: "-55deg", s: 0.85, o: 0.25 }
};


  function rel(i) {
    let d = i - current;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function render() {
    slides.forEach((slide, i) => {
      const d = rel(i);
      const p = positions[d];

      if (!p) {
        slide.style.setProperty("--o", 0);
        return;
      }

      slide.style.setProperty("--x", p.x);
      slide.style.setProperty("--z", p.z);
      slide.style.setProperty("--r", p.r);
      slide.style.setProperty("--s", p.s);
      slide.style.setProperty("--o", p.o);
      slide.style.zIndex = 10 - Math.abs(d);
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
      current = dx < 0 ? (current + 1) % total : (current - 1 + total) % total;
      render();
    }
  });

  window.addEventListener("mousedown", e => startX = e.clientX);
  window.addEventListener("mouseup", e => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 30) {
      current = dx < 0 ? (current + 1) % total : (current - 1 + total) % total;
      render();
    }
  });

});

