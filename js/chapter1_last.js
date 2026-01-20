// 最後ページ：ボタンを隣に置いてドラッグで見える
const lastPageInner = document.querySelector('#last-page .carousel-inner');
const nextBtn = document.getElementById('next-chapter-btn');

let isDrag = false;
let startX = 0;
let scrollLeft = 0;

// PC/タッチ兼用
lastPageInner.addEventListener('mousedown', e => {
  isDrag = true;
  startX = e.pageX - lastPageInner.offsetLeft;
  scrollLeft = lastPageInner.scrollLeft;
});
lastPageInner.addEventListener('touchstart', e => {
  isDrag = true;
  startX = e.touches[0].pageX - lastPageInner.offsetLeft;
  scrollLeft = lastPageInner.scrollLeft;
});

lastPageInner.addEventListener('mousemove', e => {
  if(!isDrag) return;
  e.preventDefault();
  const x = e.pageX - lastPageInner.offsetLeft;
  const walk = (startX - x);
  lastPageInner.scrollLeft = scrollLeft + walk;
});

lastPageInner.addEventListener('touchmove', e => {
  if(!isDrag) return;
  const x = e.touches[0].pageX - lastPageInner.offsetLeft;
  const walk = (startX - x);
  lastPageInner.scrollLeft = scrollLeft + walk;
});

lastPageInner.addEventListener('mouseup', () => isDrag = false);
lastPageInner.addEventListener('mouseleave', () => isDrag = false);
lastPageInner.addEventListener('touchend', () => isDrag = false);

// ボタン押下で次章へ
nextBtn.addEventListener('click', () => {
  window.location.href = 'chapter2.html';
});