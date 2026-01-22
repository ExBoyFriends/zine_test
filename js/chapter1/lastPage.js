export function initLastPage(getCurrentPage, totalPages) {
  const topImg = document.querySelector('.last-img.top');
  let opened = false;
  let startX = 0;

  const half = () => topImg.clientWidth / 2;

  topImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  topImg.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    if (Math.abs(e.clientX - startX) > 6) return;

    opened = !opened;
    topImg.style.transform = opened
      ? `translateX(${-half()}px)`
      : 'translateX(0)';
  });
}


    topImg.releasePointerCapture(e.pointerId);
  });
}


