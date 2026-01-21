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
  };

  const updateDot = () => {
    if (currentX < 0) {
      rightDot?.classList.add('active');
    } else {
      rightDot?.classList.remove('active');
    }
  };

  setX(0);
  updateDot();

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
    const nextX = startOffset + dx;

    // ▶ 右ドラッグ ＆ 初期位置 → 親に渡す
    if (nextX > 0 && currentX === 0) {
      isDragging = false;
      lastImg.releasePointerCapture(e.pointerId);
      return; // stopPropagationしない
    }

    e.stopPropagation();

    // 左右制限
    setX(Math.max(-half(), Math.min(0, nextX)));
    updateDot();
  });

  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;

    isDragging = false;
    e.stopPropagation();

    lastImg.style.transition = 'transform 0.3s ease-out';

    // 🔥 離したら必ずスナップ
    if (Math.abs(currentX) > half() / 2) {
      setX(-half());
    } else {
      setX(0);
    }

    updateDot();
    lastImg.releasePointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    lastImg.style.transition = 'transform 0.3s ease-out';
    setX(0);
    updateDot();
  });
}

