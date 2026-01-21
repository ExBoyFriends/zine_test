export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let opened = false;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;

  const setOpened = () => {
    if (opened) return;

    opened = true;
    lastImg.style.transition =
      'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${-half()}px)`;

    rightDot?.classList.add('active');
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

    // 👉 右ドラッグは常にカルーセルへ返す
    if (dx > 0) {
      isDragging = false;
      lastImg.releasePointerCapture(e.pointerId);
      return;
    }

    // すでに開いていたら追従させない
    if (opened) return;

    e.stopPropagation();

    const x = Math.max(-half(), dx);
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  });

  /* ===== pointerup ===== */
  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();

    isDragging = false;

    // 👉 離したら必ず開く
    setOpened();
  });

  /* ===== cancel ===== */
  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
  });
}
