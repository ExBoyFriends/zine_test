export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let startX = 0;
  let opened = false;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;
  const TAP_THRESHOLD = 6;

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

  /* ===== pointerdown ===== */
  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    startX = e.clientX;
    lastImg.setPointerCapture(e.pointerId);
  });

  /* ===== pointermove ===== */
  lastImg.addEventListener('pointermove', e => {
    const dx = e.clientX - startX;

    // 🔒 右ドラッグは完全に無視（返さない）
    if (dx > 0) {
      e.stopPropagation();
      return;
    }

    // 左ドラッグも無視
    e.stopPropagation();
  });

  /* ===== pointerup ===== */
  lastImg.addEventListener('pointerup', e => {
    const dx = e.clientX - startX;

    // タップのみ有効
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
    }
  });

  /* ===== cancel ===== */
  lastImg.addEventListener('pointercancel', () => {});
}

