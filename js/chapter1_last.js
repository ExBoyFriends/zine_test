const flipCard = document.getElementById('flip-card');
const frontImg = document.getElementById('front-img');
const rotImg = document.getElementById('rot-img');
const back = document.getElementById('back');

let longPressTimer = null;
let isRotatable = false;
let isDragging = false;
let startX, startY, currentRotX = 0, currentRotY = 0;

// ---------- 長押しで画像切替 ----------
flipCard.addEventListener('mousedown', startPress);
flipCard.addEventListener('touchstart', startPress);

flipCard.addEventListener('mouseup', cancelPress);
flipCard.addEventListener('mouseleave', cancelPress);
flipCard.addEventListener('touchend', cancelPress);

function startPress(e){
  if(isRotatable) return; // すでに切替済み
  longPressTimer = setTimeout(()=>{
    frontImg.style.display = 'none';
    rotImg.style.display = 'block';
    isRotatable = true;
  }, 600); // 0.6秒で切替
}

function cancelPress(e){
  clearTimeout(longPressTimer);
}

// ---------- ドラッグで回転 ----------
rotImg.addEventListener('mousedown', startDrag);
rotImg.addEventListener('touchstart', startDrag);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);

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

function endDrag(e){
  if(!isDragging) return;
  isDragging = false;
}