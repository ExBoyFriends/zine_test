export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const rightDot = document.querySelector('.dot.right-dot');

  const half = () => lastImg.clientWidth / 2;

  const setX = x => {
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  setX(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    e.stopPropagation(); // ← カルーセルに渡さない
    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    rightDot?.classList.remove('active');

    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startX;
    currentX = Math.max(-half(), Math.min(0, dx));
    setX(currentX);
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
      rightDot?.classList.add('active');
    }
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    setX(0);
    rightDot?.classList.add('active');
  });
}
