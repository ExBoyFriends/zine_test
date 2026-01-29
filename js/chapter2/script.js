document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  const total = slides.length;
  if (!total) return;

  let current = 0;
  let startX = 0;

  /* 🔑 まず全スライドを初期化（超重要） */
  slides.forEach(slide => {
    slide.style.setProperty("--x", "0vw");
    slide.style.setProperty("--z", "0px");
    slide.style.setProperty("--r", "0deg");
    slide.style.setProperty("--s", "1");
    slide.style.setProperty("--o", "0");
    slide.style.zIndex = 0;
  });

  /* 円形配置 */
  const positions = {
     0:  { x: "0vw",   z: "0px",    r: "0deg",   s: 1.05, o: 1   },

    -1:  { x: "-18vw", z: "-160px", r: "28deg",  s: 0.95, o: 0.65 },
     1:  { x: "18vw",  z: "-160px", r: "-28deg", s: 0.95, o: 0.65 },

    -2:  { x: "-30vw", z: "-360px", r: "55deg",  s: 0.85, o: 0.25 },
     2:  { x: "30vw",  z: "-360px", r: "-55deg", s: 0.85, o: 0.25 }
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
        slide.style.zIndex = 0;
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
      current = dx < 0

