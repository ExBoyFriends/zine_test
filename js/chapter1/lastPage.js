export function initLastPage(wrapper, getCurrentPage, totalPages) {
  let opened = false;
  let startX = 0;

  const TAP_THRESHOLD = 6;
  const slideTop = document.querySelector('.slide-top');
  const rightDot = document.querySelector('.dot.right-dot');

  const applyX = x => {
    slideTop.style.transition = 'transform 0.35s ease-out';
    slideTop.style.transform = translateX(${x}px)`;
  };

  const open = () => {
    opened = true;
    applyX(-slideTop.clientWidth / 2);
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;
    applyX(0);
    rightDot?.classList.remove('active');
  };

  wrapper.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  wrapper.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
    }
  });
}

