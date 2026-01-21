export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let opened = false;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;

  const TAP_THRESHOLD = 6;   // タップ判定
  const RESISTANCE = 0.12;   // 右ドラッグ抵抗
  const MAX_RESIST = 6;      // 最大抵抗px

  const open = () => {
    opened = true;
    lastImg.style.transition =
      'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${-half()}px)`;
    rightDot?.classList.add('active');
  };

  const close = () => {
    opened = false;
    lastImg.style.transition =
      'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
    lastImg.style.transform =
      'translate(-50%, -50%) translateX(0px)';
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

    const dx = e.clientX - startX;

    // 閉じている → 右ドラッグはカルーセルへ
    if (!opened && dx > 0) {
      isDragging = false;
      lastImg.releasePointerCapture(e.pointerId);
      return;
    }

    // 開いている → 右ドラッグは抵抗感
    if (opened && dx > 0) {
      e.stopPropagation();

      const resistX = Math.min(dx * RESISTANCE, MAX_RESIST);
      lastImg.style.transform =
        `translate(-50%, -50%) translateX(${-half() + resistX}px)`;
      return;
    }

    // 開いているときは追従させない
    if (opened) return;

    // 閉じている → 左ドラッグ追従
    e.stopPropagation();

    const x = Math.max(-half(), dx);
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  });

  /* ===== pointerup ===== */
  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startX;
    isDragging = false;

    lastImg.style.transition = 'transform 0.35s ease-out';

    // 抵抗でズレた分を戻す
    if (opened && dx > 0) {
      lastImg.style.transform =
        `translate(-50%, -50%) translateX(${-half()}px)`;
      return;
    }

    // タップ判定
    if (Math.abs(dx) < TAP_THRESHOLD) {
      opened ? close() : open();
      return;
    }

    // 左ドラッグは必ず開く
    if (dx < 0) {
      open();
    }
  });

  /* ===== cancel ===== */
  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
  });
}

