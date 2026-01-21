export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;

  const setX = x => {
    currentX = x;
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;

    if (x === -half()) {
      rightDot?.classList.add('active');
    } else {
      rightDot?.classList.remove('active');
    }
  };

  setX(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;

    /* 🔴 ここが最重要 */
    if (currentX === 0 && dx > 0) {
      // 右ドラッグ → カルーセルへ返す
      isDragging = false;
      lastImg.releasePointerCapture(e.pointerId);
      return;
    }

    e.stopPropagation();

    let nextX = currentX + dx;
    if (nextX < -half()) nextX = -half();
    if (nextX > 0) nextX = 0;

    setX(nextX);
    startX = e.clientX;
  });

  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();

    isDragging = false;
    lastImg.style.transition = 'transform 0.3s ease-out';

    if (Math.abs(currentX) > half() / 2) {
      setX(-half());
    } else {
      setX(0);
    }
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    lastImg.style.transition = 'transform 0.3s ease-out';
    setX(0);
  });
}
