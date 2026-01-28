export function initLastPage(wrapper, getCurrentPage, totalPages) {
  let opened = false;
  let startX = 0;

  const TAP_THRESHOLD = 6;

  const lastPage = document.getElementById('last-page');
  const slideTop = lastPage?.querySelector('.slide-top');
  const tapCover = lastPage?.querySelector('.tap-cover');
  const rightDot = document.querySelector('.dot.right-dot');

  if (!lastPage || !slideTop || !tapCover) return;

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
     tap 判定（last-page 限定）
  ===================== */
  lastPage.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  lastPage.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;

    if (Math.abs(dx) < TAP_THRESHOLD) {
      e.stopPropagation();
      opened ? close() : open();
    }
  });

  lastPage.addEventListener('pointercancel', () => {
    startX = 0;
  });

  /* =====================
     ページ離脱時の保険
  ===================== */
  document.addEventListener('pointerup', () => {
    if (getCurrentPage() !== totalPages - 1 && opened) {
      close();
    }
  });

  /* =====================
     tap-cover での伝播停止
  ===================== */
  tapCover.addEventListener('pointerup', e => {
    e.stopPropagation();
  });
}　
