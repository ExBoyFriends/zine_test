const lastPage = document.getElementById('last-page');
const flipCard = document.getElementById('flip-card');
const frontImg = document.getElementById('front-img');
const rotImg = document.getElementById('rot-img');
const back = document.getElementById('back');

let longPressTimer = null;
let isRotatable = false; // 切替後のみ回転可
let isDragging = false;
let startX = 0, startY = 0;
let currentRotX = 0, currentRotY = 0;

// ---------- 長押し開始 ----------
function startPress(e){
  if(isRotatable) return;
  e.stopPropagation(); // これ重要: 他のカルーセルイベントに届かないように

  frontImg.classList.add('glow');

  longPressTimer = setTimeout(()=>{
    // フェード切替
    frontImg.style.opacity = 0;
    rotImg.style.opacity = 1;

    setTimeout(()=>{
      frontImg.style.display = 'none';
      frontImg.classList.remove('glow');
      isRotatable = true;
    }, 3000); // CSSのフェードと同期
  }, 3000);
}

function cancelPress(e){
  e.stopPropagation();
  clearTimeout(longPressTimer);
  frontImg.classList.remove('glow');
}

lastPage.addEventListener('mousedown', startPress);
lastPage.addEventListener('touchstart', startPress);

lastPage.addEventListener('mouseup', cancelPress);
lastPage.addEventListener('mouseleave', cancelPress);
lastPage.addEventListener('touchend', cancelPress);

// ---------- ドラッグで3D回転 ----------
rotImg.addEventListener('mousedown', startDrag);
rotImg.addEventListener('touchstart', startDrag);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag, {passive:false});

document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function startDrag(e){
  if(!isRotatable) return;
  isDragging = true;
  startX = e.touches ? e.touches[0].pageX : e.pageX;
  startY = e.touches ? e.touches[0].pageY : e.pageY;
  rotImg.classList.add('rotating');
}

function drag(e){
  if(!isDragging) return;
  e.preventDefault();
  const x = e.touches ? e.touches[0].pageX : e.pageX;
  const y = e.touches ? e.touches[0].pageY : e.pageY;

  const deltaX = x - startX;
  const deltaY = y - startY;

  currentRotY += deltaX * 0.5;
  currentRotX -= deltaY * 0.5;

  rotImg.style.transform = `rotateY(${currentRotY}deg) rotateX(${currentRotX}deg)`;
  back.style.transform = `rotateY(${180 + currentRotY}deg) rotateX(${currentRotX}deg)`;

  startX = x;
  startY = y;
}

function endDrag(){
  if(!isDragging) return;
  isDragging = false;
}