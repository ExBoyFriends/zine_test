// lastPage.js
export function initLastPage(lastImg, nextBtn, getCurrentPage, totalPages) {
  if (!lastImg || !nextBtn) return;

  const maxShift = lastImg.clientWidth / 2; // 画面半分分
  let isLastImgShifted = false;

  lastImg.style.transform = 'translateX(0)'; // 初期中央
  nextBtn.style.pointerEvents = 'none';      // 初期は操作不可

  lastImg.addEventListener('click', () => {
    // 現在ページが最後ページでない場合は無効
    if (getCurrentPage() !== totalPages - 1) return;

    lastImg.style.transition = 'transform 0.3s ease-out';

    if (!isLastImgShifted) {
      // 左に半分スライド
      lastImg.style.transform = `translateX(${-maxShift}px)`;
      isLastImgShifted = true;

      // ボタンを操作可能に
      nextBtn.style.pointerEvents = 'auto';
    } else {
      // 初期位置に戻す
      lastImg.style.transform = 'translateX(0)';
      isLastImgShifted = false;

      // ボタン操作不可
      nextBtn.style.pointerEvents = 'none';
    }
  });
}