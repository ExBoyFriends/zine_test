export function initLastPage(wrapper, getCurrentPage, totalPages) {
  let opened = false;
  let startX = 0;

  const TAP_THRESHOLD = 6;

  const lastPage = document.getElementById('last-page');
  if (!lastPage) return;

  const slideTop = lastPage.querySelector('.slide-top');
  const tapCover = lastPage.querySelector('.tap-cover');
  const topTapZone = lastPage.querySelector('.top-tap-zone');
  const rightDot = document.querySelector('.dot.right-dot');

  if (!slideTop || !tapCover || !topTapZone) return;

  const TRANSITION =
    'transform 1.4s cubic-bezier(.16,1.3,.3,1)';

  const applyX = x => {
    slideTop.style.transition = TRANSITION;
    slideTop.style.transform = `translateX(${x}px)`;
  };

  const isActive = () =>
    lastPage.classList.contains('active');

  const open = () => {
    if (!isActive()) return;
    opened = true;
    const visibleWidth = slideTop.clientWidth / 2;
    tapCover.style.pointerEvents = 'auto';
    applyX(-visibleWidth);
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;
    tapCover.style.pointerEvents = 'none';
    applyX(0);
    rightDot?.classList.remove('active');
  };

  topTapZone.addEventListener('pointerdown', e => {
    if (!isActive()) return;
    if (e.button !== 0) return;
    startX = e.clientX;
  });

  topTapZone.addEventListener('pointerup', e => {
    if (!isActive()) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP_THRESHOLD) {
      e.stopPropagation();
      opened ? close() : open();
    }
  });

  topTapZone.addEventListener('pointercancel', () => {
    startX = 0;
  });

  tapCover.addEventListener('pointerup', e => {
    if (!isActive()) return;
    e.stopPropagation();
  });
}


