/* =========================
   Chapter 2 Circular Carousel
   ========================= */

const slides = document.querySelectorAll(".slide");
const total = slides.length;

let current = 0;
let startX = 0;
let dragging = false;

/*
  相対位置ごとの見え方
  円形の内側を覗くイメージ
  見えるのは「中央＋左右」
*/
const positions = {
  0:  { x: 0,   z: 0,   r: 0,   s: 1,    o: 1 },
 -1:  { x: -55, z: 120, r: 35,  s: 1.0,  o: 0.85 },
  1:  { x: 55,  z: 120, r: -35, s: 1.0,  o: 0.85 },
 -2:  { x: -110,z: 260, r: 75,  s: 0.9,  o: 0 },
  2:  { x: 110, z: 260, r: -75, s: 0.9,  o: 0 }
};

/* 現在位置からの相対インデックス取得（ループ対応） */
function getRelativeIndex(i) {
  let diff = i - current;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

/* 描画 */
function render() {
  slides.forEach((slide, i) => {
    const d = getRelativeIndex(i);
    const p = positions[d];

    if (!p) {
      slide.style.opacity = 0;
      slide.style.pointerEvents = "none";
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
    slide.style.pointerEvents = d === 0 ? "auto" : "none";
  });
}

/* 初期描画 */
render();

/* =========================
   スワイプ & マウス操作
   ========================= */

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

  if (Math.abs(dx) > 40) {
    current = dx < 0
      ? (current + 1) % total
      : (current - 1 + total) % total;
    render();
  }

  dragging = false;
}

/* touch */
window.addEventListener("touchstart", onStart, { passive: true });
window.addEventListener("touchend", onEnd);

/* mouse */
window.addEventListener("mousedown", onStart);
window.addEventListener("mouseup", onEnd);

