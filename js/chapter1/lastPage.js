export function initLastPage(wrapper, getCurrentPage, totalPages) {
  let opened = false;

  const rightDot = document.querySelector('.dot.right-dot');
  const TAP_THRESHOLD = 6;

  let startX = 0;

  const half = () => wrapper.clientWidth / 2;

  const applyX = x => {
    wrapper.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

const slideTop = document.querySelector('.slide-top');
  
  const open = () => {
  opened = true;

  topImg.style.transition =
    'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';

  applyX(-topImg.clientWidth);
  rightDot?.classList.add('active');
};

const close = () => {
  opened = false;

  topImg.style.transition =
    'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';

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

