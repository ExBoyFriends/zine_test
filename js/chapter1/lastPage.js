export function initLastPage(lastImg, getCurrentPage, total) {
  let startX = 0;
  let currentX = 0;

  const half = () => lastImg.clientWidth / 2;

  const move = x => {
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  move(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== total - 1) return;
    e.stopPropagation();

    startX = e.clientX;
    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    e.stopPropagation();
    const dx = e.clientX - startX;
    currentX = Math.max(-half(), Math.min(0, dx));
    move(currentX);
  });

  lastImg.addEventListener('pointerup', e => {
    e.stopPropagation();
    if (Math.abs(currentX) < half() / 2) {
      move(0);
      currentX = 0;
    } else {
      move(-half());
    }
  });
}
