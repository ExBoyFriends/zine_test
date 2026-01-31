// inputDrag.js
export function initDragInput(carousel) {
  const scene = document.querySelector(".scene");
  if (!scene) return;

  let isDown = false;
  let isDragging = false;

  let startX = 0;
  let lastX = 0;

  const DRAG_THRESHOLD = 6; // px（これ超えたらドラッグ開始）

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
    const dx = x - lastX;
    const totalDx = x - startX;

    // まだドラッグ扱いしない（＝長押し優先）
    if (!isDragging) {
      if (Math.abs(totalDx) < DRAG_THRESHOLD) {
        return;
      }

      // 🔥 ここで初めてドラッグ開始
      isDragging = true;
      carousel.startDrag();
    }

    carousel.moveDrag(dx);
    lastX = x;
  });

  /* =====================
     POINTER UP / CANCEL
  ===================== */
  function endPointer(e) {
    if (!isDown) return;

    if (isDragging) {
      carousel.endDrag();
    }

    isDown = false;
    isDragging = false;

    scene.releasePointerCapture?.(e.pointerId);
  }

  scene.addEventListener("pointerup", endPointer);
  scene.addEventListener("pointercancel", endPointer);
  scene.addEventListener("pointerleave", endPointer);
}
