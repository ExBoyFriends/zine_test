export function initLastPage(lastImg, nextBtn, getCurrentPage, totalPages) {
  let maxShift = 0;
  let isShifted = false;

  // 画像ロード後に幅を計算して安全に半分スライド
  if (lastImg.complete) {
    maxShift = lastImg.clientWidth / 2;
  } else {
    lastImg.addEventListener('load', () => {
      maxShift = lastImg.clientWidth / 2;
    });
  }

  // 初期状態
  lastImg.style.transform = 'translateX(0)'; // 中央
  lastImg.style.display = 'block';
  nextBtn.style.pointerEvents = 'none';

  lastImg.addEventListener('click', () => {
    if (getCurrentPage() !== totalPages - 1) return;

    if (!isShifted) {
      lastImg.style.transform = `translateX(${-maxShift}px)`; // 左に半分
      isShifted = true;
      nextBtn.style.pointerEvents = 'all';
    } else {
      lastImg.style.transform = 'translateX(0)'; // 初期位置に戻す
      isShifted = false;
      nextBtn.style.pointerEvents = 'none';
    }
  });

  nextBtn.addEventListener('click', () => {
    window.location.href = 'chapter2.html';
  });
}