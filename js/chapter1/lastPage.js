export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;
  let currentX = 0;
  let allowCarousel = false;

  const rightDot = document.querySelector('.dot.right-dot');

  const half = () => lastImg.clientWidth / 2;

  const setX = x => {
    currentX = x;
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  const updateDot = () => {
    rightDot?.classList.toggle('active', currentX < 0);
  };

  setX(0);
  updateDot();

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    startX = e.clientX;
    startOffset = currentX;

    // 🔑 初期位置 ＆ 右ドラッグ → 最初から親に任せる
    allowCarousel = currentX === 0;

    if (!allowCarousel) {
      e.stopPropagation();
      isDragging = true;
      lastImg.style.transition = 'none';
      lastImg.setPointerCapture(e.pointerId);
    }
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;

    e.stopPropagation();

    const dx = e.clientX - startX;
    const nextX = startOffset + dx;

    setX(Math.max(-half(), Math.min(0, nextX)));
    updateDot();
  });

  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;

    e.stopPropagation();
    isDragging = false;

    lastImg.style.transition = 'transform 0.3s ease-out';

    // 🔥 必ずスナップ
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
