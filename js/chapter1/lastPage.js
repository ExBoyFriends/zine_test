export function initLastPage(lastImg, carousel, totalPages) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;

  const setX = x => {
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  setX(0);

  lastImg.addEventListener('pointerdown', e => {
    if (carousel.getCurrentPage() !== totalPages - 1) return;

    e.stopPropagation();

    dragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    lastImg.classList.add('dragging');

    carousel.lock(true);
    rightDot?.classList.remove('active');

    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!dragging) return;
    e.stopPropagation();

    currentX = Math.max(-half(), Math.min(0, e.clientX - startX));
    setX(currentX);
  });

  lastImg.addEventListener('pointerup', e => {
    if (!dragging) return;
    e.stopPropagation();

    dragging = false;
    lastImg.classList.remove('dragging');
    lastImg.style.transition = 'transform 0.3s ease-out';

    if (Math.abs(currentX) > half() / 2) {
      setX(-half());
    } else {
      setX(0);
      rightDot?.classList.add('active');
      carousel.lock(false);
    }
  });

  lastImg.addEventListener('pointercancel', () => {
    dragging = false;
    setX(0);
    rightDot?.classList.add('active');
    carousel.lock(false);
  });
}
