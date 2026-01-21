export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;
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
    startOffset = currentX;

    lastImg.style.transition = 'none';
    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    let nextX = startOffset + dx;

    /* 🔴 右ドラッグの扱いが最重要 */
    if (nextX > 0) {
      // 画像が中央にある時だけカルーセルへ返す
      if (startOffset === 0) {
        isDragging = false;
        lastImg.releasePointerCapture(e.pointerId);
        return;
      }
      nextX = 0;
    }

    if (nextX < -half()) nextX = -half();

    e.stopPropagation();
    setX(nextX);
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

