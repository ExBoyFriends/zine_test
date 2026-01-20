/* ------------------------
   初期設定
------------------------ */
const pages = document.querySelectorAll('.carousel-page');
const dots = document.querySelectorAll('.dot');
const dotsContainer = document.querySelector('.dots');
const loader = document.getElementById('loader');
const wrapper = document.querySelector('.carousel-wrapper');
const lastPageInner = document.querySelector('#last-page .carousel-inner');
const nextBtnWrapper = document.querySelector('#last-page .next-btn-wrapper');
const nextBtn = document.getElementById('next-chapter-btn');

let currentPage = 0;
let isDragging = false, dragX = 0, startX = 0, lastX = 0, lastTime = 0, velocity = 0, isAnimating = false;
const pageWidth = wrapper.clientWidth;

/* ------------------------
   初回ロード（サイレン＋ドット遅延表示）
------------------------ */
window.addEventListener('load', () => {
  const firstPage = pages[0];
  isAnimating = true;
  firstPage.classList.add('first-load', 'active');
  loader.style.display = 'block';

  setTimeout(() => {
    loader.style.display = 'none';
    firstPage.classList.remove('first-load');
    firstPage.style.transition = 'opacity 5.2s ease';
    
    // ドット遅延フェードイン
    dotsContainer.classList.add('visible');
    updateDots();
    isAnimating = false;
  }, 7280); // サイレン＋初回フェード時間
});

/* ------------------------
   ドラッグ操作（カルーセル切替）
------------------------ */
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
  const threshold = pageWidth * 0.3;
  const velocityThreshold = 0.3;

  if ((dragX < -threshold || velocity < -velocityThreshold) && currentPage < pages.length - 1) nextPage = currentPage + 1;
  else if ((dragX > threshold || velocity > velocityThreshold) && currentPage > 0) nextPage = currentPage - 1;

  if (nextPage !== null) {
    isAnimating = true;
    pages.forEach(p => { p.style.opacity = ''; });
    pages[currentPage].classList.remove('active');
    pages[nextPage].classList.add('active');
    setTimeout(() => { isAnimating = false; }, 3000);
    currentPage = nextPage;
  } else {
    pages[currentPage].style.opacity = 1;
    if (dragX < 0 && currentPage < pages.length - 1) pages[currentPage + 1].style.opacity = 0;
    if (dragX > 0 && currentPage > 0) pages[currentPage - 1].style.opacity = 0;
  }

  dragX = 0; velocity = 0;
  updateDots();
}

/* ------------------------
   ドット更新＆◀︎▶︎表示制御
------------------------ */
function updateDots() {
  // ハイライト（左端◀︎を除いてcurrentPageに対応）
  dots.forEach((dot, i) => {
    if(i === currentPage + 1) dot.classList.add('active');
    else dot.classList.remove('active');
  });

  // 左端◀︎
  dots[0].style.opacity = (currentPage === 0) ? 0 : 1;

  // 右端▶︎
  const lastDotIndex = dots.length - 1;
  if(currentPage === pages.length - 1){
    dots[lastDotIndex].style.opacity = 0; // 完全非表示
  } else {
    dots[lastDotIndex].style.opacity = 1;
  }
}

/* ------------------------
   イベントリスナー（カルーセル）
------------------------ */
wrapper.addEventListener('mousedown', e => startDrag(e.pageX));
wrapper.addEventListener('touchstart', e => startDrag(e.touches[0].pageX));
wrapper.addEventListener('mousemove', e => drag(e.pageX));
wrapper.addEventListener('touchmove', e => drag(e.touches[0].pageX));
wrapper.addEventListener('mouseup', endDrag);
wrapper.addEventListener('mouseleave', endDrag);
wrapper.addEventListener('touchend', endDrag);

/* ------------------------
   ページ内画像ドラッグ
------------------------ */
document.querySelectorAll('.carousel-inner').forEach(inner => {
  let isDragInner = false, start, scrollLeft;
  inner.addEventListener('mousedown', e => { isDragInner = true; inner.classList.add('dragging'); start = e.pageX - inner.offsetLeft; scrollLeft = inner.scrollLeft; });
  inner.addEventListener('mouseleave', () => { isDragInner = false; inner.classList.remove('dragging'); });
  inner.addEventListener('mouseup', () => { isDragInner = false; inner.classList.remove('dragging'); });
  inner.addEventListener('mousemove', e => { if (!isDragInner) return; e.preventDefault(); inner.scrollLeft = scrollLeft + (start - (e.pageX - inner.offsetLeft)); });
  inner.addEventListener('touchstart', e => { isDragInner = true; start = e.touches[0].pageX - inner.offsetLeft; scrollLeft = inner.scrollLeft; });
  inner.addEventListener('touchend', () => { isDragInner = false; });
  inner.addEventListener('touchmove', e => { if (!isDragInner) return; inner.scrollLeft = scrollLeft + (start - (e.touches[0].pageX - inner.offsetLeft)); });
});

/* ------------------------
   右クリック・長押し無効
------------------------ */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('touchmove', e => { if(e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault());

/* ------------------------
   最後ページ：横スクロールで次章ボタン出現
------------------------ */
let isDragLast = false, startXLast = 0, scrollLeftLast = 0;

lastPageInner.addEventListener('mousedown', e => { isDragLast = true; startXLast = e.pageX - lastPageInner.offsetLeft; scrollLeftLast = lastPageInner.scrollLeft; });
lastPageInner.addEventListener('touchstart', e => { isDragLast = true; startXLast = e.touches[0].pageX - lastPageInner.offsetLeft; scrollLeftLast = lastPageInner.scrollLeft; });

function handleLastDrag(x){
  if(!isDragLast) return;
  const walk = startXLast - x;
  lastPageInner.scrollLeft = scrollLeftLast + walk;

  // ボタンの表示（徐々に）
  const maxScroll = lastPageInner.scrollWidth - lastPageInner.clientWidth;
  let ratio = Math.min(Math.max(lastPageInner.scrollLeft / maxScroll, 0), 1);
  nextBtnWrapper.style.right = `${-140 + 140 * ratio}px`;
}

lastPageInner.addEventListener('mousemove', e => { handleLastDrag(e.pageX); });
lastPageInner.addEventListener('touchmove', e => { handleLastDrag(e.touches[0].pageX); });
lastPageInner.addEventListener('mouseup', () => isDragLast = false);
lastPageInner.addEventListener('mouseleave', () => isDragLast = false);
lastPageInner.addEventListener('touchend', () => isDragLast = false);

/* ------------------------
   次章ボタン
------------------------ */
nextBtn.addEventListener('click', () => { window.location.href = 'chapter2.html'; });