export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let opened = false;

  const rightDot = document.querySelector('.dot.right-dot');
  const TAP_THRESHOLD = 6;
  const half = () => lastImg.clientWidth / 2;

  let startX = 0;

  const applyX = x => {
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  const open = () => {
    opened = true;
    lastImg.style.transition =
      'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
    applyX(-half());
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;
    lastImg.style.transition =
      'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
    applyX(0);
    rightDot?.classList.remove('active');
  };

  /* ===== タップ判定のみ ===== */
  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  lastImg.addEventListener('pointerup', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;

    // 👆 タップだけ反応
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
    }
  });
}

