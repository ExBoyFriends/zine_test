// 最後のページ要素
const frontImg = document.getElementById('front-img');
const rotImg = document.getElementById('rot-img');
const back = document.getElementById('back');
const nextBtn = document.getElementById('next-chapter-btn');

let longPressTimer = null;
let isRotatable = false;

// ---------- 長押しで切替 ----------
function startPress(e){
  e.preventDefault();
  if(isRotatable) return;

  longPressTimer = setTimeout(()=>{
    // 浮き出し演出
    frontImg.classList.add('floating');

    setTimeout(()=>{
      // 表画像を非表示、回転画像表示
      frontImg.style.display = 'none';
      rotImg.style.display = 'block';
      rotImg.style.transform = 'rotateY(0deg)';
      back.classList.add('visible');
      isRotatable = true;
    }, 800);
  }, 700);
}

function cancelPress(){ clearTimeout(longPressTimer); }

frontImg.addEventListener('mousedown', startPress);
frontImg.addEventListener('mouseup', cancelPress);
frontImg.addEventListener('mouseleave', cancelPress);
frontImg.addEventListener('touchstart', startPress);
frontImg.addEventListener('touchend', cancelPress);
frontImg.addEventListener('touchcancel', cancelPress);

// ---------- 回転画像ドラッグ ----------
let isDragging = false;
let startX = 0;
let rotationY = 0;

rotImg.addEventListener('mousedown', e=>{
  isDragging = true;
  startX = e.pageX;
  rotImg.style.cursor='grabbing';
});
rotImg.addEventListener('mousemove', e=>{
  if(!isDragging) return;
  const deltaX = e.pageX - startX;
  rotationY = Math.max(-25, Math.min(25, deltaX / 5));
  rotImg.style.transform = `rotateY(${rotationY}deg)`;
});
rotImg.addEventListener('mouseup', e=>{
  isDragging = false;
  rotImg.style.cursor='grab';
  rotImg.style.transition = 'transform 0.5s ease-out';
  rotImg.style.transform = 'rotateY(0deg)';
  setTimeout(()=> rotImg.style.transition='transform 0.2s ease',500);
});
rotImg.addEventListener('mouseleave', ()=>{ isDragging=false; rotImg.style.cursor='grab'; });

// タッチ対応
rotImg.addEventListener('touchstart', e=>{ isDragging=true; startX=e.touches[0].pageX; });
rotImg.addEventListener('touchmove', e=>{
  if(!isDragging) return;
  const deltaX = e.touches[0].pageX - startX;
  rotationY = Math.max(-25, Math.min(25, deltaX / 5));
  rotImg.style.transform = `rotateY(${rotationY}deg)`;
});
rotImg.addEventListener('touchend', e=>{
  isDragging=false;
  rotImg.style.transition='transform 0.5s ease-out';
  rotImg.style.transform='rotateY(0deg)';
  setTimeout(()=> rotImg.style.transition='transform 0.2s ease',500);
});

// ---------- 第二章ボタン ----------
nextBtn.addEventListener('click', ()=>{
  // 第二章へ移行する処理
  window.location.href='chapter2.html';
});
