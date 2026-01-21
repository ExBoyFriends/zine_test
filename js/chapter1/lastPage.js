export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let opened = false;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;

  const setOpened = () => {
    opened = true;
    lastImg.style.transition = 'transform 0.35s ease-out';
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

    // 🔴 右ドラッグは常にカルーセルへ返す
    if (dx > 0) {
      isDragging = false;
      lastImg.releasePointerCapture(e.pointerId);
      return;
    }

    // すでに開いていたら何もしない
    if (opened) return;

    e.stopPropagation();

    let x = Math.max(-half(), dx);
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  });

  /* ===== pointerup ===== */
 lastImg.addEventListener('pointerup', e => {
  if (!isDragging) return;
  e.stopPropagation();

  isDragging = false;

  lastImg.style.transition =
    'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';

  setX(-half()); // ← 常に左へ
});

  /* ===== cancel ===== */
  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
  });
}
