document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  const total = slides.length;
  if (!total) return;

  let current = 0;
  let startX = 0;

  /*
    円形配置パラメータ
    x : 横位置
    z : 奥行き（負で奥）
    r : Y回転
    o : 透明度
    s : サイズ
  */
  const positions = {
     0: { x:   0,  z:   0,  r:   0, s: 1.0, o: 1   },
    -1: { x: -28, z: -180, r:  35, s: 0.9, o: 0.6 },
     1: { x:  28, z: -180, r: -35, s: 0.9, o: 0.6 },
    -2: { x: -45, z: -360, r:  65, s: 0.8, o: 0.25 },
     2: { x:  45, z: -360, r: -65, s: 0.8, o: 0.25 }
  };

  function getRelativeIndex(i) {
    let d = i - current;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function render() {
    slides.forEach((slide, i) => {
      const d = getRelativeIndex(i);
      const p = positions[d];

      if (!p) {
        slide.style.opacity = 0;
        return;
      }

      slide.style.transform = `
        translate(-50%, -50%)
        translateX(${p.x}vw)
        translateZ(${p.z}px)
        rotateY(${p.r}deg)
        scale(${p.s})
      `;

      slide.style.opacity = p.o;
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
        ? (current + 1) % total
        : (current - 1 + total) % total;
      render();
    }
  });

  /* マウス */
  window.addEventListener("mousedown", e => startX = e.clientX);
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

