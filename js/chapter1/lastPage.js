export function initLastPage(wrapper, getCurrentPage, totalPages) {
  let opened = false;
  let startX = 0;

  const TAP_THRESHOLD = 6;

  const slideTop = document.querySelector('.slide-top');
  const tapCover = document.querySelector('.tap-cover');
  const rightDot = document.querySelector('.dot.right-dot');

  if (!slideTop || !tapCover) return;

  const TRANSITION =
    'transform 1.4s cubic-bezier(.16,1.3,.3,1)';

  /* =====================
     transform（中央基準）
  ===================== */
  const applyX = x => {
    slideTop.style.transition = TRANSITION;
    tapCover.style.transition = TRANSITION;

    slideTop.style.transform = `translateX(${x}px)`;
    tapCover.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  /* =====================
     open / close
  ===================== */
  const open = () => {
    opened = true;

    const visibleWidth = slideTop.clientWidth / 2;

    tapCover.style.width = `${visibleWidth}px`;
    tapCover.style.pointerEvents = 'auto';

    applyX(-visibleWidth);
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;

    tapCover.style.pointerEvents = 'none';
    tapCover.style.width = '0';

    applyX(0);
    rightDot?.classList.remove('active');
  };

  /* =====================
     tap 判定（ドラッグ完全無視）
  ===================== */
  wrapper.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  wrapper.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;

    if (Math.abs(dx) < TAP_THRESHOLD) {
      e.stopPropagation();
      opened ? close() : open();
    }
  });

  wrapper.addEventListener('pointercancel', () => {
    startX = 0;
  });

  tapCover.addEventListener('pointerup', e => {
    e.stopPropagation();
  });
}
