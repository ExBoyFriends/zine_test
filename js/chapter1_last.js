const lastPage = document.getElementById('last-page');
const lastImg = document.getElementById('front-img');
let isLastRotatable = false; // 切替後にカルーセル横スライドを無効化
let longpressTimer = null;

// 長押し用レイヤー
const longpressLayer = document.createElement('div');
longpressLayer.style.position = 'absolute';
longpressLayer.style.inset = '0';
longpressLayer.style.zIndex = '10';
longpressLayer.style.background = 'transparent';
lastPage.querySelector('.carousel-inner').appendChild(longpressLayer);

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

longpressLayer.addEventListener('mousedown', startLongPress);
longpressLayer.addEventListener('touchstart', startLongPress);

longpressLayer.addEventListener('mouseup', cancelLongPress);
longpressLayer.addEventListener('mouseleave', cancelLongPress);
longpressLayer.addEventListener('touchend', cancelLongPress);
longpressLayer.addEventListener('touchcancel', cancelLongPress);

// ---------------- フェード切替＆回転可能 ----------------
function activateFlip() {
  isLastRotatable = true; // これで横スライド無効化

  const rotImg = document.getElementById('rot-img');
  rotImg.style.display = 'block';
  rotImg.style.opacity = 0;
  rotImg.style.transition = 'opacity 3s';
  
  setTimeout(() => { rotImg.style.opacity = 1; lastImg.style.display = 'none'; }, 50);

  enable3DRotation(rotImg);
}

// ---------------- 3D回転 ----------------
function enable3DRotation(img) {
  let isRotating = false;
  let startX = 0;
  let rotY = 0;

  img.addEventListener('mousedown', e => { isRotating = true; startX = e.pageX; img.style.cursor='grabbing'; });
  img.addEventListener('mousemove', e => {
    if (!isRotating) return;
    rotY += (e.pageX - startX)/2;
    img.style.transform = `rotateY(${rotY}deg)`;
    startX = e.pageX;
  });
  img.addEventListener('mouseup', e => { isRotating = false; img.style.cursor='grab'; });
  img.addEventListener('mouseleave', e => { isRotating = false; img.style.cursor='grab'; });

  img.addEventListener('touchstart', e => { isRotating = true; startX = e.touches[0].pageX; });
  img.addEventListener('touchmove', e => {
    if (!isRotating) return;
    rotY += (e.touches[0].pageX - startX)/2;
    img.style.transform = `rotateY(${rotY}deg)`;
    startX = e.touches[0].pageX;
  });
  img.addEventListener('touchend', e => { isRotating = false; });
}