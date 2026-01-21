export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let opened = false;
  let baseX = 0;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;
  const TAP_THRESHOLD = 6;
  const RESISTANCE = 0.25;

  const applyX = x => {
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  const open = () => {
    opened = true;
    baseX = -half();
    lastImg.style.transition =
      'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
    applyX(baseX);
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;
    baseX = 0;
    lastImg.style.transition =
      'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
    applyX(baseX);
    rightDot?.classList.remove('active');
  };

  /* ===== pointerdown ===== */
  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    lastImg.setPointerCapture(e.pointerId);
  });

  /* ===== pointermove ===== */
  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;

    let dx = e.clientX - startX;

    // 🔒 閉じている時の右ドラッグは「完全無反応」
    if (!opened && dx > 0) {
      dx = 0;
    }

    // 🟡 開いている時の右ドラッグは「抵抗感」
    if (opened && dx > 0) {
      dx *= RESISTANCE;
    }

    // 🟡 左ドラッグも抵抗（もう使わない操作）
    if (dx < 0) {
      dx *= RESISTANCE;
    }

    e.stopPropagation();

    const nextX = Math.max(-half(), Math.min(0, baseX + dx));
    applyX(nextX);
  });

  /* ===== pointerup ===== */
  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startX;
    isDragging = false;

    // タップで開閉
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
      return;
    }

    // 状態を必ず正規位置に戻す
    lastImg.style.transition =
      'transform 0.4s ease-out';
    applyX(baseX);

     startX = e.clientX;
  baseX = nextX;
    
  });

  /* ===== cancel ===== */
  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    lastImg.style.transition =
      'transform 0.4s ease-out';
    applyX(baseX);
  });
}
