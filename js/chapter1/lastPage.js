export function initLastPage(lastImg, nextBtn, getCurrentPage, totalPages) {
  const maxShift = lastImg.clientWidth / 2;
  let isShifted = false;

  // 初期状態で中央に表示
  lastImg.style.transform = 'translateX(0)';
  lastImg.style.display = 'block';
  nextBtn.style.pointerEvents = 'none';

  lastImg.addEventListener('click', () => {
    if (getCurrentPage() !== totalPages - 1) return;

    lastImg.style.transition = 'transform 0.3s ease-out';

    if (!isShifted) {
      // 左に半分スライド
      lastImg.style.transform = `translateX(${-maxShift}px)`;
      isShifted = true;
      nextBtn.style.pointerEvents = 'all';
    } else {
      // 中央に戻す
      lastImg.style.transform = 'translateX(0)';
      isShifted = false;
      nextBtn.style.pointerEvents = 'none';
    }
  });

  nextBtn.addEventListener('click', () => {
    window.location.href = 'chapter2.html';
  });
}