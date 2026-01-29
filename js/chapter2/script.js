document.addEventListener("DOMContentLoaded", () => {

/* =========================
   Chapter 2 Circular Carousel
   ========================= */

const slides = document.querySelectorAll(".slide");
const total = slides.length;

if (total === 0) return;

let current = 0;
let startX = 0;
let dragging = false;

const positions = {
  0:  { x: 0,   z: 0,   r: 0,   s: 1,    o: 1 },
 -1:  { x: -45, z: 100, r: 25,  s: 1.0,  o: 0.9 },
  1:  { x: 45,  z: 100, r: -25, s: 1.0,  o: 0.9 },
 -2:  { x: -90, z: 220, r: 65,  s: 0.9,  o: 0 },
  2:  { x: 90,  z: 220, r: -65, s: 0.9,  o: 0 }
};

function getRelativeIndex(i) {
  let diff = i - current;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
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
      translateX(${p.x}%)
      translateZ(${p.z}px)
      rotateY(${p.r}deg)
      scale(${p.s})
    `;
    slide.style.opacity = p.o;
    slide.style.zIndex = 10 - Math.abs(d);
  });
}

render();

/* 操作 */
function onStart(e) {
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  dragging = true;
}

function onEnd(e) {
  if (!dragging) return;

  const endX = e.changedTouches
    ? e.changedTouches[0].clientX
    : e.clientX;

  const dx = endX - startX;

  if (Math.abs(dx) > 15) {
    current = dx < 0
      ? (current + 1) % total
      : (current - 1 + total) % total;
    render();
  }

  dragging = false;
}

window.addEventListener("touchstart", onStart);
window.addEventListener("touchend", onEnd);
window.addEventListener("mousedown", onStart);
window.addEventListener("mouseup", onEnd);

});

