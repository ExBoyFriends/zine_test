export function initLastPage(topImg, getCurrentPage, totalPages) {
  let opened = false;
  let startX = 0;
  const TAP_THRESHOLD = 6;

  const link = document.querySelector('.last-link');

  const open = () => {
    opened = true;
    topImg.style.transform = 'translateX(-100%)';
    link.classList.add('active');
  };

  const close = () => {
    opened = false;
    topImg.style.transform = 'translateX(0)';
    link.classList.remove('active');
  };

  topImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
    topImg.setPointerCapture(e.pointerId);
  });

  topImg.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;

    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
    }

    topImg.releasePointerCapture(e.pointerId);
  });
}


