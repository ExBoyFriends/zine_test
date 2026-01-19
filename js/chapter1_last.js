const frontImg = document.getElementById('front-img');
const rotImg = document.getElementById('rot-img');
const flipCard = document.getElementById('flip-card');
const back = document.getElementById('back');
let pressTimer = null;
let isRotated = false;

// 長押し検知
frontImg.addEventListener('mousedown', startPress);
frontImg.addEventListener('touchstart', startPress);
frontImg.addEventListener('mouseup', cancelPress);
frontImg.addEventListener('mouseleave', cancelPress);
frontImg.addEventListener('touchend', cancelPress);
frontImg.addEventListener('touchcancel', cancelPress);

function startPress(e){
  if(isRotated) return;
  e.preventDefault();
  pressTimer = setTimeout(()=>{
    // 画像切替
    frontImg.style.opacity=0;
    rotImg.style.display='block';
    setTimeout(()=>{ frontImg.style.display='none'; rotImg.style.opacity=1; }, 200);
    isRotated=true;
    enableRotate(rotImg);
  }, 600); // 0.6秒長押しで切替
}

function cancelPress(){
  clearTimeout(pressTimer);
}

// ---------- ドラッグで回転 ----------
function enableRotate(img){
  let dragging=false, startX=0, rotY=0;
  img.addEventListener('mousedown', e=>{ dragging=true; startX=e.pageX; });
  img.addEventListener('mousemove', e=>{ if(!dragging) return; let dx=e.pageX-startX; img.style.transform=`rotateY(${rotY + dx}deg)`; });
  img.addEventListener('mouseup', e=>{ if(dragging){ rotY += e.pageX - startX; dragging=false; }});
  img.addEventListener('mouseleave', e=>{ if(dragging){ rotY += e.pageX - startX; dragging=false; }});
  img.addEventListener('touchstart', e=>{ dragging=true; startX=e.touches[0].pageX; });
  img.addEventListener('touchmove', e=>{ if(!dragging) return; let dx=e.touches[0].pageX-startX; img.style.transform=`rotateY(${rotY + dx}deg)`; });
  img.addEventListener('touchend', e=>{ if(dragging){ rotY += e.changedTouches[0].pageX - startX; dragging=false; }});
}

// ---------- 次の章ボタン ----------
document.getElementById('next-chapter-btn').addEventListener('click', ()=>{
  window.location.href = 'HTML/chapter2.html'; // ここは次章のURLに合わせる
});