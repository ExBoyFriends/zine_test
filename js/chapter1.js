/* =========================
   初期設定
========================= */
const pages = document.querySelectorAll('.carousel-page');
const dots = document.querySelectorAll('.dot');
const dotsContainer = document.querySelector('.dots');
const loader = document.getElementById('loader');
const wrapper = document.querySelector('.carousel-wrapper');
const lastImg = document.querySelector('.last-img');
const nextBtn = document.getElementById('next-chapter-btn');

let currentPage = 0;
let isDragging = false;
let dragX = 0, startX = 0, lastX = 0, lastTime = 0, velocity = 0;
let isAnimating = false;
const pageWidth = wrapper.clientWidth;

/* =========================
   初回ロード：サイレン＋ドット遅延表示
========================= */
window.addEventListener('load', () => {
  const firstPage = pages[0];
  isAnimating = true;

  firstPage.classList.add('first-load', 'active');
  loader.style.display = 'block';

  setTimeout(() => {
    loader.style.display = 'none';
    firstPage.classList.remove('first-load');
    firstPage.style.transition = 'opacity 5.2s ease';

    dotsContainer.classList.add('visible');
    updateDots();
    isAnimating = false;
  }, 7280);
});

/* =========================
   通常カルーセルドラッグ操作
========================= */
function startDrag(x) {
  if (isAnimating) return;
  isDragging = true;
  startX = x;
  lastX = x;
  lastTime = Date.now();
}

function drag(x) {
  if (!isDragging || isAnimating) return;
  dragX = x - startX;
  const now = Date.now();
  velocity = (x - lastX) / (now - lastTime);
  lastX = x; lastTime = now;

  // 最後ページで画像半分移動中なら通常カルーセルは無効
  if (currentPage === pages.length - 1 && isLastImgShifted && dragX > 0) return;

  const ease = 0.4;
  if (dragX < 0 && currentPage < pages.length - 1) {
    pages[currentPage + 1].style.opacity = Math.min(Math.abs(dragX) / pageWidth, 1) * ease;
    pages[currentPage].style.opacity = 1 - Math.min(Math.abs(dragX) / pageWidth, 1) * ease;
  } else if (dragX > 0 && currentPage > 0) {
    pages[currentPage - 1].style.opacity = Math.min(Math.abs(dragX) / pageWidth, 1) * ease;
    pages[currentPage].style.opacity = 1 - Math.min(Math.abs(dragX) / pageWidth, 1) * ease;
  }
}

function endDrag() {
  if (!isDragging || isAnimating) return;
  isDragging = false;

  let nextPage = null;
  const threshold = pageWidth * 0.25;
  const velocityThreshold = 0.25;

  if ((dragX < -threshold || velocity < -velocityThreshold) && currentPage < pages.length - 1) nextPage = currentPage + 1;
  else if ((dragX > threshold || velocity > velocityThreshold) && currentPage > 0) nextPage = currentPage - 1;

  if (nextPage !== null) {
    isAnimating = true;
    pages.forEach(p => { p.style.opacity = ''; });
    pages[currentPage].classList.remove('active');
    pages[nextPage].classList.add('active');
    setTimeout(() => { isAnimating = false; }, 1400);
    currentPage = nextPage;
} else {
  const pull = Math.abs(dragX);
  const nearEdge = pull > threshold * 0.9; // ほぼ境界まで来てたか

  // 隣のページ取得
  let neighbor = null;
  if (dragX < 0 && currentPage < pages.length - 1) neighbor = pages[currentPage + 1];
  if (dragX > 0 && currentPage > 0) neighbor = pages[currentPage - 1];

  if (nearEdge) {
    // 端で一瞬止まって、ほんの少し戻る
    isAnimating = true;

    const holdTime = 60;       // 端で止まる時間(ms)
    const bounceBack = 0.04;   // 戻る量（4%）
    const duration = 140;     // 戻る速さ

    setTimeout(() => {
      const start = performance.now();

      function softReturn(t) {
        const progress = Math.min((t - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 2);

        // ほんの少し戻す
        pages[currentPage].style.opacity = 1 - bounceBack * ease;
        if (neighbor) {
          neighbor.style.opacity = bounceBack * (1 - ease);
        }

        if (progress < 1) {
          requestAnimationFrame(softReturn);
        } else {
          // 最終位置で固定
          pages[currentPage].style.opacity = 1;
          if (neighbor) neighbor.style.opacity = 0;
          isAnimating = false;
        }
      }

      requestAnimationFrame(softReturn);
    }, holdTime);

  } else {
    // 普通に戻る（今まで通り）
    pages[currentPage].style.opacity = 1;
    if (dragX < 0 && currentPage < pages.length - 1)
      pages[currentPage + 1].style.opacity = 0;
    if (dragX > 0 && currentPage > 0)
      pages[currentPage - 1].style.opacity = 0;
  }
}

  dragX = 0;
  velocity = 0;
  updateDots();
}

/* =========================
   ドット更新
========================= */
function updateDots() {
  dots.forEach((dot, i) => {
    if (i === 0 || i === dots.length - 1) return; 
    dot.classList.toggle('active', i === currentPage + 1);
  });
  dots[0].style.opacity = (currentPage === 0) ? 0 : 1;
  dots[dots.length - 1].style.opacity = (currentPage === pages.length - 1) ? 0 : 1;
}

/* =========================
   カルーセルイベント
========================= */
wrapper.addEventListener('mousedown', e => startDrag(e.pageX));
wrapper.addEventListener('touchstart', e => startDrag(e.touches[0].pageX));
wrapper.addEventListener('mousemove', e => drag(e.pageX));
wrapper.addEventListener('touchmove', e => drag(e.touches[0].pageX));
wrapper.addEventListener('mouseup', endDrag);
wrapper.addEventListener('mouseleave', endDrag);
wrapper.addEventListener('touchend', endDrag);

/* =========================
   ページ内画像ドラッグ（通常ページ）
========================= */
document.querySelectorAll('.carousel-inner').forEach(inner => {
  let isDrag = false, start, scrollLeft;
  inner.addEventListener('mousedown', e => { isDrag = true; inner.classList.add('dragging'); start = e.pageX - inner.offsetLeft; scrollLeft = inner.scrollLeft; });
  inner.addEventListener('mouseleave', () => { isDrag = false; inner.classList.remove('dragging'); });
  inner.addEventListener('mouseup', () => { isDrag = false; inner.classList.remove('dragging'); });
  inner.addEventListener('mousemove', e => { if (!isDrag) return; e.preventDefault(); inner.scrollLeft = scrollLeft + (start - (e.pageX - inner.offsetLeft)); });
  inner.addEventListener('touchstart', e => { isDrag = true; start = e.touches[0].pageX - inner.offsetLeft; scrollLeft = inner.scrollLeft; });
  inner.addEventListener('touchend', () => { isDrag = false; });
  inner.addEventListener('touchmove', e => { if (!isDrag) return; inner.scrollLeft = scrollLeft + (start - (e.touches[0].pageX - inner.offsetLeft)); });
});

/* =========================
   右クリック・長押し無効
========================= */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault());

/* =========================
   最後ページタップ操作（半分スライド／初期位置復帰）
========================= */
const maxShift = lastImg.clientWidth / 2;
let lastImgOffset = 0;
let isLastImgShifted = false;

lastImg.addEventListener('click', () => {
  if (currentPage !== pages.length -1) return;

  lastImg.style.transition = 'transform 0.3s ease-out';

  if (!isLastImgShifted) {
    // 半分スライド
    lastImgOffset = maxShift;
    lastImg.style.transform = `translateX(${-lastImgOffset}px)`;
    isLastImgShifted = true;
  } else {
    // 初期位置に戻す
    lastImgOffset = 0;
    lastImg.style.transform = `translateX(0px)`;
    isLastImgShifted = false;
  }
});

/* =========================
   次章ボタン
========================= */
nextBtn.addEventListener('click', () => { window.location.href = 'chapter2.html'; });