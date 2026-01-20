export function initLastPage(lastImg, nextBtn, getCurrentPage, totalPages) {
  if (!lastImg || !nextBtn) return;

  const maxShift = lastImg.clientWidth / 2; // 左に半分スライド
  let isLastImgShifted = false;

  lastImg.style.transform = 'translateX(0)';
  nextBtn.style.pointerEvents = 'none';

  lastImg.addEventListener('click', () => {
    if (getCurrentPage() !== totalPages - 1) return;

    lastImg.style.transition = 'transform 0.3s ease-out';

    if (!isLastImgShifted) {
      lastImg.style.transform = `translateX(${-maxShift}px)`; // 左方向
      isLastImgShifted = true;
      nextBtn.style.pointerEvents = 'auto';
    } else {
      lastImg.style.transform = 'translateX(0)';
      isLastImgShifted = false;
      nextBtn.style.pointerEvents = 'none';
    }
  });
}