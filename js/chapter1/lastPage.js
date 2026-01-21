export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const rightDot = document.querySelector('.dot.right-dot');

  const getHalf = () => lastImg.clientWidth / 2;

  const setTransform = x => {
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  setTransform(0);

  /* ===== ドラッグ開始 ===== */
  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    // 🔴 ここが超重要：カルーセル側にイベントを渡さない
    e.stopPropagation();

    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    lastImg.classList.add('dragging');

    // 右ドットのハイライトを消す
    rightDot?.classList.remove('active');

    lastImg.setPointerCapture(e.pointerId);
  });

  /* ===== ドラッグ中 ===== */
  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startX;
    currentX = Math.max(-getHalf(), Math.min(0, dx));
    setTransform(currentX);
  });

  /* ===== ドラッグ終了 ===== */
  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();

    isDragging = false;
    lastImg.classList.remove('dragging');
    lastImg.style.transition = 'transform 0.3s ease-out';

    if (Math.abs(currentX) > getHalf() / 2) {
      // 半分以上 → 左に固定
      setTransform(-getHalf());
      currentX = -getHalf();
      // ドットは消えたまま
    } else {
      // 戻す
      setTransform(0);
      currentX = 0;
      rightDot?.classList.add('active');
    }
  });

  lastImg.addEventListener('pointercancel', e => {
    e.stopPropagation();
    isDragging = false;
    setTransform(0);
    rightDot?.classList.add('active');
  });
}


