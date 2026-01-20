export function initLastPage(lastImg, getCurrentPage, totalPages) {
  const maxShift = lastImg.clientWidth / 2;
  let isShifted = false;

  lastImg.style.transform = 'translateX(0)';
  lastImg.style.display = 'block';

  // 上の画像でクリックやドラッグが下に届かないようにする
  lastImg.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
  lastImg.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
  lastImg.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); }, { passive:false });

  // 上の画像をクリックしたら左に半分スライド
  lastImg.addEventListener('click', () => {
    if (getCurrentPage() !== totalPages - 1) return;

    lastImg.style.transition = 'transform 0.3s ease-out';

    if (!isShifted) {
      lastImg.style.transform = `translateX(${-maxShift}px)`; // 左に半分
      isShifted = true;
    } else {
      lastImg.style.transform = 'translateX(0)'; // 中央に戻す
      isShifted = false;
    }
  });
}