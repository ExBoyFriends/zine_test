// inputDrag.js
export function initDragInput(carousel) {
  const scene = document.querySelector(".scene");
  if (!scene) return;

  let isDown = false;
  let isDragging = false;

  let startX = 0;
  let lastX = 0;

  const DRAG_THRESHOLD = 6; // px（これ超えたらドラッグ）

  /* =====================
     POINTER DOWN
  ===================== */

  scene.addEventListener("pointerdown", e => {
    isDown = true;
    isDragging = false;

    startX = lastX = e.clientX;

    scene.setPointerCapture?.(e.pointerId);
  });

  /* =====================
     POINTER MOVE
  ===================== */

  scene.addEventListener("pointermove", e => {
    if (!isDown) return;

    const x = e.clientX;

