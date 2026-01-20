/* =========================
   初期設定
========================= */
const pages = document.querySelectorAll('.carousel-page');
const dots = document.querySelectorAll('.dot');
const dotsContainer = document.querySelector('.dots');
const loader = document.getElementById('loader');
const wrapper = document.querySelector('.carousel-wrapper');
const lastPageInner = document.querySelector('#last-page .carousel-inner');
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

    // ドットを遅延表示
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

  dragX = 0;
  velocity = 0;
  updateDots();
}

/* =========================
   ドット更新＆左右端表示制御
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
   最後ページ左ドラッグ＋自動スライド
========================= */
const maxShift = lastImg.clientWidth / 2;
let lastImgOffset = 0;
let isDragLast = false;
let startXLast = 0;
let animationFrameId = null;

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

// ドラッグ開始
function startDragLast(e) {
  if (currentPage !== pages.length -1) return;
  isDragLast = true;
  const pageX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
  startXLast = pageX - lastImgOffset;
  lastImg.classList.add('dragging');
  if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
}

lastImg.addEventListener('mousedown', startDragLast);
lastImg.addEventListener('touchstart', startDragLast);

// ドラッグ中
function dragLastImg(e) {
  if (!isDragLast) return;
  const pageX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
  let delta = pageX - startXLast;
  if (delta < 0) {
    lastImgOffset = clamp(-delta, 0, maxShift);
    lastImg.style.transform = `translateX(${-lastImgOffset}px)`;
  }
}

lastImg.addEventListener('mousemove', dragLastImg);
lastImg.addEventListener('touchmove', dragLastImg);

// ドラッグ終了 → 自動スライド
function endDragLast() {
  if (!isDragLast) return;
  isDragLast = false;
  lastImg.classList.remove('dragging');

  if (lastImgOffset < maxShift) {
    const step = () => {
      lastImgOffset += 8; // スピード調整
      if (lastImgOffset >= maxShift) lastImgOffset = maxShift;
      lastImg.style.transform = `translateX(${-lastImgOffset}px)`;
      if (lastImgOffset < maxShift) animationFrameId = requestAnimationFrame(step);
    };
    step();
  }
}

lastImg.addEventListener('mouseup', endDragLast);
lastImg.addEventListener('mouseleave', endDragLast);
lastImg.addEventListener('touchend', endDragLast);

/* =========================
   次章ボタン
========================= */
nextBtn.addEventListener('click', () => { window.location.href = 'chapter2.html'; });