export function initLastPage(topImg, getCurrentPage, total) {
  let opened = false;
  let startX = 0;
  const TAP = 6;

  const open = () => {
    opened = true;
    topImg.style.transform = `translateX(-100%)`;
  };

  const close = () => {
    opened = false;
    topImg.style.transform = `translateX(0)`;
  };

  topImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== total - 1) return;
    startX = e.clientX;
  });

  topImg.addEventListener('pointerup', e => {
    if (getCurrentPage() !== total - 1) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP) {
      opened ? close() : open();
    }
  });
}

