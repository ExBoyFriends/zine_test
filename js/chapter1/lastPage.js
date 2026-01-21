export function initLastPage(lastImg, getCurrentPage, totalPages, goPrev) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const rightDot = document.querySelector('.dot.right-dot');
  const half = () => lastImg.clientWidth / 2;

  const setX = x => {
    currentX = x;
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;
  };

  setX(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    e.stopPropagation();
    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    rightDot?.classList.remove('active');

    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startX;

    // 🔑 ずれた状態では右方向は「中央まで」しか戻れない
    if (currentX < 0 && dx > 0) {
      setX(Math.min(0, currentX + dx));
      startX = e.clientX;
      return;
    }

    // 🔑 初期位置では左方向のみずらせる
    if (currentX === 0 && dx < 0) {
      setX(Math.max(-half(), dx));
    }
  });

  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();
    isDragging = false;

    lastImg.style.transition = 'transform 0.3s ease-out';

    // 🔵 初期位置 → 右ドラッグ → 前ページへ
    if (currentX === 0 && e.clientX - startX > half() / 2) {
      goPrev();
      return;
    }

    // 🔵 ずれた状態 → 右ドラッグ → 中央に戻す
    if (currentX < 0 && Math.abs(currentX) < half() / 2) {
      setX(0);
      rightDot?.classList.add('active');
      return;
    }

    // 🔵 左にしっかりずらしたら固定
    if (Math.abs(currentX) > half() / 2) {
      setX(-half());
      return;
    }

    // デフォルト：中央
    setX(0);
    rightDot?.classList.add('active');
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    setX(0);
    rightDot?.classList.add('active');
  });
}
