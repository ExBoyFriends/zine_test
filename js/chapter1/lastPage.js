export function initLastPage(topImg, getCurrentPage, totalPages) {
  let opened = false;
  const rightDot = document.querySelector('.dot.right-dot');
  const TAP_THRESHOLD = 6;

  let startX = 0;

  const open = () => {
    opened = true;
    topImg.style.transform = `translateX(-100%)`;
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;
    topImg.style.transform = `translateX(0)`;
    rightDot?.classList.remove('active');
  };

  topImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  topImg.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
    }
  });
}
