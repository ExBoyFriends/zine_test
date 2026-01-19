const frontImg = document.getElementById('front-img');
const rotImg = document.getElementById('rot-img');
const back = document.getElementById('back');
let longpressTimer = null;
let isRotatable = false;
let startX, startY, rotateX = 0, rotateY = 0;

// 長押し開始
function startLongPress(e){
  e.preventDefault();
  if(isRotatable) return;
  frontImg.classList.add('glow');
  longpressTimer = setTimeout(() => {
    frontImg.classList.remove('glow');
    frontImg.style.display = 'none';
    rotImg.style.display = 'block';
    isRotatable = true;
  }, 3000);
}

// 長押しキャンセル
function cancelLongPress(e){
  frontImg.classList.remove('glow');
  clearTimeout(longpressTimer);
}

// イベント
frontImg.addEventListener('mousedown', startLongPress);
frontImg.addEventListener('mouseup', cancelLongPress);
frontImg.addEventListener('mouseleave', cancelLongPress);

frontImg.addEventListener('touchstart', startLongPress);
frontImg.addEventListener('touchend', cancelLongPress);
frontImg.addEventListener('touchcancel', cancelLongPress);

// ドラッグで3D回転
rotImg.addEventListener('mousedown', e=>{
  if(!isRotatable) return;
  startX = e.pageX; startY = e.pageY;
  rotImg.classList.add('rotating');
  document.addEventListener('mousemove', rotateDrag);
  document.addEventListener('mouseup', stopRotate);
});

rotImg.addEventListener('touchstart', e=>{
  if(!isRotatable) return;
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
  rotImg.classList.add('rotating');
  document.addEventListener('touchmove', rotateDragTouch);
  document.addEventListener('touchend', stopRotateTouch);
});

function rotateDrag(e){
  const dx = e.pageX - startX;
  const dy = e.pageY - startY;
  rotateY += dx * 0.5;
  rotateX -= dy * 0.5;
  rotImg.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  startX = e.pageX; startY = e.pageY;
}

function rotateDragTouch(e){
  const dx = e.touches[0].pageX - startX;
  const dy = e.touches[0].pageY - startY;
  rotateY += dx * 0.5;
  rotateX -= dy * 0.5;
  rotImg.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  startX = e.touches[0].pageX; startY = e.touches[0].pageY;
}

function stopRotate(){
  rotImg.classList.remove('rotating');
  document.removeEventListener('mousemove', rotateDrag);
  document.removeEventListener('mouseup', stopRotate);
}

function stopRotateTouch(){
  rotImg.classList.remove('rotating');
  document.removeEventListener('touchmove', rotateDragTouch);
  document.removeEventListener('touchend', stopRotateTouch);
}