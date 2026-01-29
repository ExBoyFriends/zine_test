const slides = document.querySelectorAll(".slide");
const total = slides.length;

let current = 0;
let startX = 0;
let dragging = false;

/**
 * 各相対位置の見え方
 * 手前に来すぎると視界外に消える設計
 */
const positions = {
  0:  { x: 0,   z: 0,   r: 0,   s: 1,    o: 1 },
  -1: { x: -30,z: 140, r: 30,  s: 1.05, o: 0.8 },
   1: { x: 30, z: 140, r: -30, s: 1.05, o: 0.8 },
  -2: { x: -60,z: 260, r: 75,  s: 0.95, o: 0 },
   2: { x: 60, z: 260, r: -75, s: 0.95, o: 0 }
};

/**
 * 今の正面（current）から見た相対位置を -2〜+2 に丸める
 */
function getRelativeIndex(i) {
  let diff = i - current;
  if (diff > 2) diff -= total;
  if (diff < -2) diff += total;
  return diff;
}

/**
 * 描画
 */
function render() {
  slides.forEach((slide, i) => {
    const d = getRelativeIndex(i);
    const p = positions[d];

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

render();

/**
 * タッチ操作
 */
window.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  dragging = true;
});

window.addEventListener("touchend", e => {
  if (!dragging) return;

  const dx = e.changedTouches[0].clientX - startX;

  if (Math.abs(dx) > 40) {
    if (dx < 0) {
      // 右方向（時計回り）
      current = (current + 1) % total;
    } else {
      // 左方向（反時計回り）
      current = (current - 1 + total) % total;
    }
    render();
  }

  dragging = false;
});
