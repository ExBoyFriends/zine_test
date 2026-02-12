// chapter2/inputDrag.js

export function initDragInput(carousel) {
  const scene = document.querySelector(".scene");
  if (!scene || !carousel) return;
  let isDragging = false, startX = 0, lastX = 0;
  const DRAG_THRESHOLD = 6;

  scene.addEventListener("pointerdown", e => { startX = lastX = e.clientX; isDragging = false; });
  scene.addEventListener("pointermove", e => {
    const x = e.clientX, dx = x - lastX, totalDx = x - startX;
    if (!isDragging && Math.abs(totalDx) >= DRAG_THRESHOLD) { isDragging = true; carousel.startDrag?.(); }
    if (isDragging) { carousel.moveDrag?.(dx); lastX = x; }
  });
  scene.addEventListener("pointerup", () => { if (isDragging) { carousel.endDrag?.(); isDragging = false; } });
  scene.addEventListener("pointercancel", () => { if (isDragging) { carousel.endDrag?.(); isDragging = false; } });
}
