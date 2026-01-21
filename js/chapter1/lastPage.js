export function initLastPage(lastImg, getCurrentPage, totalPages) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const rightDot = document.querySelector('.dot.right-dot'); // ← 追加

  const getHalf = () => lastImg.clientWidth / 2;

  const setTransform = x =>
    lastImg.style.transform = `translate(-50%, -50%) translateX(${x}px)`;

  setTransform(0);

  lastImg.addEventListener('pointerdown', e => {
    if (getCurrentPage() !== totalPages - 1) return;

    isDragging = true;
    startX = e.clientX;
    lastImg.style.transition = 'none';
    lastImg.classList.add('dragging');

    // ✅ ここ！！！ドラッグ開始で右ドットのハイライトを消す
    rightDot?.classList.remove('active');

    lastImg.setPointerCapture(e.pointerId);
  });

  lastImg.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    currentX = Math.max(-getHalf(), Math.min(0, dx));
    setTransform(currentX);
  });

  lastImg.addEventListener('pointerup', () => {
    if (!isDragging) return;

    isDragging = false;
    lastImg.classList.remove('dragging');
    lastImg.style.transition = 'transform 0.3s ease-out';

    if (Math.abs(currentX) > getHalf() / 2) {
      setTransform(-getHalf());
      currentX = -getHalf();
      // 👉 固定したまま（ドットは消えたまま）
    } else {
      setTransform(0);
      currentX = 0;

      // 🔁 中央に戻ったらハイライト復活（不要なら消してOK）
      rightDot?.classList.add('active');
    }
  });

  lastImg.addEventListener('pointercancel', () => {
    isDragging = false;
    setTransform(0);
    rightDot?.classList.add('active');
  });
}    
