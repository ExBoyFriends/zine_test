// inputDrag.js
export function initDragInput(carousel) {
  let lastX = 0;

  const start = x => {
    lastX = x;
    carousel.startDrag();
  };

  const move = x => {
    const dx = x - lastX;
    carousel.moveDrag(dx);
    lastX = x;
  };

  const end = () => {
    carousel.endDrag();
  };

  // マウスイベント
  window.addEventListener("mousedown", e => start(e.clientX));
  window.addEventListener("mousemove", e => move(e.clientX));
  window.addEventListener("mouseup", end);

  // タッチイベント
  window.addEventListener("touchstart", e => {
    e.preventDefault();
    start(e.touches[0].clientX);
  }, { passive: false });

  window.addEventListener("touchmove", e => {
    e.preventDefault();
    move(e.touches[0].clientX);
  }, { passive: false });

  window.addEventListener("touchend", e => {
    e.preventDefault();
    end();
  }, { passive: false });
}
