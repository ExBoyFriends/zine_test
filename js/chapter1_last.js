const lastPage = document.getElementById('last-page');
const lastImg = document.getElementById('front-img');
let isLastRotatable = false; // 切替後にカルーセル横スライド無効化
let longpressTimer = null;

// 最後のページ内 carousel-inner を relative に
const inner = lastPage.querySelector('.carousel-inner');
inner.style.position = 'relative';

// ---------------- 長押し用レイヤー作成 ----------------
const longpressLayer = document.createElement('div');
longpressLayer.style.position = 'absolute';
longpressLayer.style.top = '0';
longpressLayer.style.left = '0';
longpressLayer.style.width = '100%';
longpressLayer.style.height = '100%';
longpressLayer.style.zIndex = '10';
longpressLayer.style.background = 'transparent';
longpressLayer.style.cursor = 'pointer';
inner.appendChild(longpressLayer);

// ---------------- 長押しイベント ----------------
function startLongPress() {
  lastImg.classList.add('glow'); // 光アニメーション
  longpressTimer = setTimeout(() => {
    lastImg.classList.remove('glow');
    activateFlip();
  }, 3000); // 3秒長押し
}

function cancelLongPress() {
  lastImg.classList.remove('glow');
  clearTimeout(longpressTimer);
}

// 長押しスタート
/*function startLongPress(e) {
  e.preventDefault(); // タッチスクロールを止める
  console.log('長押しスタート', e.type);
  lastImg.classList.add('glow'); // 光アニメーション
  longpressTimer = setTimeout(() => {
    console.log('長押し成功 → フェード切替発動');
    lastImg.classList.remove('glow');
    activateFlip();
  }, 3000);
}*/

// 長押しキャンセル
function cancelLongPress(e) {
  console.log('長押しキャンセル', e.type);
  lastImg.classList.remove('glow');
  clearTimeout(longpressTimer);
}

// マウス
longpressLayer.addEventListener('mousedown', startLongPress);
longpressLayer.addEventListener('mouseup', cancelLongPress);
longpressLayer.addEventListener('mouseleave', cancelLongPress);

// タッチ
longpressLayer.addEventListener('touchstart', startLongPress);
longpressLayer.addEventListener('touchend', cancelLongPress);
longpressLayer.addEventListener('touchcancel', cancelLongPress);

// ---------------- フェード切替＆回転可能 ----------------
function activateFlip() {
  isLastRotatable = true; // カルーセル横スライド無効化

  const rotImg = document.getElementById('rot-img');
  rotImg.style.display = 'block';
  rotImg.style.opacity = 0;
  rotImg.style.transition = 'opacity 3s';
  
  setTimeout(() => { 
    rotImg.style.opacity = 1; 
    lastImg.style.display = 'none'; 
    enable3DRotation(rotImg);
  }, 50);
}

// ---------------- 3D回転 ----------------
function enable3DRotation(img) {
  let isRotating = false;
  let startX = 0;
  let rotY = 0;

  // マウス
  img.addEventListener('mousedown', e => { isRotating = true; startX = e.pageX; img.style.cursor='grabbing'; });
  img.addEventListener('mousemove', e => {
    if (!isRotating) return;
    rotY += (e.pageX - startX)/2;
    img.style.transform = `rotateY(${rotY}deg)`;
    startX = e.pageX;
  });
  img.addEventListener('mouseup', e => { isRotating = false; img.style.cursor='grab'; });
  img.addEventListener('mouseleave', e => { isRotating = false; img.style.cursor='grab'; });

  // タッチ
  img.addEventListener('touchstart', e => { isRotating = true; startX = e.touches[0].pageX; });
  img.addEventListener('touchmove', e => {
    if (!isRotating) return;
    rotY += (e.touches[0].pageX - startX)/2;
    img.style.transform = `rotateY(${rotY}deg)`;
    startX = e.touches[0].pageX;
  });
  img.addEventListener('touchend', e => { isRotating = false; });
}