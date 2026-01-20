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
    pages[currentPage].style.opacity = 1;
    if (dragX < 0 && currentPage < pages.length - 1) pages[currentPage + 1].style.opacity = 0;
    if (dragX > 0 && currentPage > 0) pages[currentPage - 1].style.opacity = 0;
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



html, body {
  margin: 0; padding: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  background: #000;
  -webkit-user-select: none; user-select: none;
  -webkit-touch-callout: none;
}

body {
  min-height: 100svh; /* SafariのUI変動対策 */
}

/* 背景 */
.background {
  position: fixed; top: -40px; left: -40px; right: -40px; bottom: -40px;
  background: url('../image/background.jpg') center/cover no-repeat;
  z-index: 0;
  animation: slowFade 20s ease-in-out infinite alternate;
}

/* ローダー（サイレン） */
#loader {
  position: fixed; top: -40px; left: -40px; right: -40px; bottom: -40px;
  background: url('../image/background.jpg') center/cover no-repeat;
  z-index: 10;
  animation: siren 1.68s linear infinite;
}

/* カルーセル */
.carousel-wrapper {
  position: fixed; inset:0;
  width: 100vw; height: 100vh;
  z-index:1; overflow:hidden;
  display:flex; justify-content:center; align-items:center;
  transform: translateY(-env(safe-area-inset-bottom)/2);
}

.carousel-page {
  position:absolute; inset:0;
  display:flex; justify-content:center; align-items:center;
  gap:10px; pointer-events:none;
  opacity:0; transition: opacity 1.4s ease;
}

.carousel-page.active {
  opacity:1; pointer-events:all;
}

.carousel-page.first-load {
  opacity:0; transition: opacity 7.25s ease;
}

.carousel-inner { display:flex; gap:10px; cursor:grab; overflow:hidden; justify-content:center; }
.carousel-inner.single { justify-content:center; }
.carousel-inner img { width:88vw; max-width:540px; border-radius:8px; flex-shrink:0; -webkit-user-drag:none; }
.dragging { cursor:grabbing; }

/* ドット */
.dots {
  position: fixed; left:0; right:0;
  bottom:calc(40px + env(safe-area-inset-bottom));
  width:100%; text-align:center; z-index:20;
  opacity:0; transition:opacity 0.8s ease;
}

.dot {
  display:inline-block; width:5px; height:8px;
  margin:0 5px; border-radius:0;
  background: rgba(200,200,200,0.25);
  box-shadow: 0 0 4px rgba(255,255,255,0.3);
  transition:opacity 0.5s ease, background 0.3s ease;
  opacity:1;
}

.dot.active { background: rgba(240,240,240,0.9); box-shadow:0 0 8px rgba(255,255,255,0.6); }
.left-dot { width:12px; height:12px; clip-path: polygon(100% 0%,0% 50%,100% 100%); }
.right-dot { width:12px; height:12px; clip-path: polygon(0% 0%,100% 50%,0% 100%); }

.dots.visible { opacity:1; }

//* 最後ページ */
#last-page .carousel-inner {
  display:flex; align-items:center; gap:20px; position:relative;
  overflow: hidden; /* 横スライドを可能に */
}

.last-img {
  width:88vw; max-width:540px;
  border-radius:8px; flex-shrink:0;
  cursor:grab;
  transition: transform 0.2s ease-out; /* 自動スライド時のアニメーション */
}

.next-btn-wrapper {
  position:absolute; bottom:20px; left:50%;
  transform: translateX(-50%);
  width:120px; display:flex; justify-content:center; align-items:center;
  pointer-events:none; /* 初期は操作不可 */
}

/* アニメーション */
@keyframes slowFade { 0%{filter:brightness(1);}50%{filter:brightness(0.2);}100%{filter:brightness(1);} }
@keyframes siren { 0%{filter:brightness(1);}50%{filter:brightness(0.2);}100%{filter:brightness(1);} }



いま、これが現状で完璧なコード
白いのも消えた