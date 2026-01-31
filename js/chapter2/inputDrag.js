// inputDrag.js
export function initDragInput(carousel) {
  const scene = document.querySelector(".scene");
  if (!scene) return;

  let isDragging = false;
  let startX = 0;
  let lastX = 0;

  const DRAG_THRESHOLD = 6;

  // 🔥 holdTransition 側から呼ばれる
  window.__startDragCheck__ = e => {
    startX = lastX = e.clientX;
    isDragging = false;
  };

  window.__moveDragCheck__ = e => {
    const x = e.clientX;
    const dx = x - lastX;
    const totalDx = x - startX;

    if (!isDragging) {
      if (Math.abs(totalDx) < DRAG_THRESHOLD) return;

      isDragging = true;
      carousel.startDrag();
    }

    carousel.moveDrag(dx);
    lastX = x;
  };

  window.__endDragCheck__ = () => {
    if (isDragging) carousel.endDrag();
    isDragging = false;
  };
}

