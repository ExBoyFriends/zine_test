const lastPage = document.getElementById('last-page');
const lastImg = document.getElementById('last-img');
const nextBtn = document.getElementById('next-chapter-btn');

let startX = 0;
let dragX = 0;

// ドラッグ開始
lastImg.addEventListener('mousedown', e => { startX = e.pageX; });
lastImg.addEventListener('touchstart', e => { startX = e.touches[0].pageX; });

// ドラッグ中
lastImg.addEventListener('mousemove', e => {
  if(!startX) return;
  dragX = e.pageX - startX;
  if(dragX < -50) lastPage.classList.add('show-btn');
});
lastImg.addEventListener('touchmove', e => {
  if(!startX) return;
  dragX = e.touches[0].pageX - startX;
  if(dragX < -50) lastPage.classList.add('show-btn');
});

// ドラッグ終了
lastImg.addEventListener('mouseup', () => startX = dragX = 0);
lastImg.addEventListener('mouseleave', () => startX = dragX = 0);
lastImg.addEventListener('touchend', () => startX = dragX = 0);

// ボタン押下でページ遷移
nextBtn.addEventListener('click', () => {
  window.location.href = 'chapter2.html';
});