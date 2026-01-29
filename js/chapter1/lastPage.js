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
     開閉アニメーション
  ===================== */
  const applyX = x => {
    slideTop.style.transition = TRANSITION;
    slideTop.style.transform = `translateX(${x}px)`;
  };

  const open = () => {
    opened = true;
    lastPage.classList.add('opened');

    const slideWidth = slideTop.clientWidth / 2;
    applyX(-slideWidth);

    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;
    lastPage.classList.remove('opened');

    applyX(0);
    rightDot?.classList.remove('active');
  };

  /* =====================
     Top画像のみで開閉
  ===================== */
  slideTop.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    startX = e.clientX;
  });

  slideTop.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
    }
  });

  /* =====================
     リンク時に伝播停止
  ===================== */
  tapCover.addEventListener('pointerup', e => {
    e.stopPropagation();
  });

  /* =====================
     ページ離脱時リセット
  ===================== */
  document.addEventListener('pointerup', () => {
    if (getCurrentPage() !== totalPages - 1 && opened) {
      close();
    }
  });
}

