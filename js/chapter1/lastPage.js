export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const getHalf = () => lastImg.clientWidth / 2;

  // 初期位置（必ず中央）
  const setTransform = x =>
    lastImg.style.transform = `translate(-50%, -50%) translateX(${x}px)`;

  setTransform(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    lastImg.classList.add('dragging');

    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    currentX = Math.max(-getHalf(), Math.min(0, dx)); // 左半分まで

    setTransform(currentX);
  });

  lastImg.addEventListener('pointerup', () => {
    if (!isDragging) return;

    isDragging = false;
    lastImg.classList.remove('dragging');
    lastImg.style.transition = 'transform 0.3s ease-out';

    // 半分以上引いたら固定、戻したら中央
    if (Math.abs(currentX) > getHalf() / 2) {
      setTransform(-getHalf());
      currentX = -getHalf();
    } else {
      setTransform(0);
      currentX = 0;
    }
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    setTransform(0);
  });
}
