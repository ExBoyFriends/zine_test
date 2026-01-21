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

  // 初期位置
  setX(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    e.stopPropagation();

    isDragging = true;
    startX = e.clientX;
    startOffset = currentX;   // ★ これが超重要

    lastImg.style.transition = 'none';
    rightDot?.classList.remove('active');

    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startX;
    let nextX = startOffset + dx;

    // 左は half まで、右は 0 まで
    nextX = Math.max(-half(), Math.min(0, nextX));

    setX(nextX);
  });

  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();

    isDragging = false;
    lastImg.releasePointerCapture(e.pointerId);
    lastImg.style.transition = 'transform 0.3s ease-out';

    // 半分以上引いたらリンク画像を出す
    if (Math.abs(currentX) > half() / 2) {
      setX(-half());
      rightDot?.classList.add('active');
    } else {
      setX(0);
      rightDot?.classList.remove('active');
    }
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    lastImg.style.transition = 'transform 0.3s ease-out';
    setX(0);
    rightDot?.classList.remove('active');
  });
}


