export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const rightDot = document.querySelector('.dot.right-dot');

  const half = () => lastImg.clientWidth / 2;

  const setX = x => {
    currentX = x;
    lastImg.style.transform =
      `translate(-50%, -50%) translateX(${x}px)`;

    // 🔴 ドット制御：リンク画像が見えている時だけON
    if (x === -half()) {
      rightDot?.classList.add('active');
    } else {
      rightDot?.classList.remove('active');
    }
  };

  setX(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    // 🔴 初期位置で右ドラッグ開始 → カルーセルに渡す
    if (currentX === 0 && e.movementX > 0) {
      return;
    }

    e.stopPropagation();
    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startX;
    let nextX = currentX + dx;

    // 左：リンク画像が見える位置まで
    if (nextX < -half()) nextX = -half();

    // 右：中央まで（それ以上は禁止）
    if (nextX > 0) nextX = 0;

    setX(nextX);
    startX = e.clientX;
  });

  lastImg.addEventListener('pointerup', e => {
    if (!isDragging) return;
    e.stopPropagation();

    isDragging = false;
    lastImg.style.transition = 'transform 0.3s ease-out';

    // 🔴 スナップ判定
    if (Math.abs(currentX) > half() / 2) {
      setX(-half()); // リンク画像表示
    } else {
      setX(0);       // 中央に戻る
    }
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    lastImg.style.transition = 'transform 0.3s ease-out';
    setX(0);
  });
}

