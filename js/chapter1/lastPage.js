export function initLastPage(getCurrentPage, totalPages) {
  const topImg = document.querySelector('.last-img.top');
  if (!topImg) return;

  let opened = false;
  let startX = 0;
  const TAP_THRESHOLD = 6;

  const half = () => topImg.clientWidth / 2;

  topImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  topImg.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) > TAP_THRESHOLD) return;

    opened = !opened;
    topImg.style.transform = opened
      ? `translateX(${-half()}px)`
      : 'translateX(0)';
  });
}

