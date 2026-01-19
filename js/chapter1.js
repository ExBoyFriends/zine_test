const pages = document.querySelectorAll('.carousel-page');
const dots = document.querySelectorAll('.dot');
const dotsContainer = document.querySelector('.dots');
let currentPage = 0;
let isDragging = false, dragX = 0, startX = 0, lastX = 0, lastTime = 0, velocity = 0, isAnimating = false;
const wrapper = document.querySelector('.carousel-wrapper');
const pageWidth = wrapper.clientWidth;
const loader = document.getElementById('loader');

// ---------- 初回ロード ----------
window.addEventListener('load', ()=>{
  const firstPage = pages[0];
  isAnimating = true;
  firstPage.classList.add('first-load', 'active');
  loader.style.display='block';

  setTimeout(()=>{
    loader.style.display='none';
    firstPage.classList.remove('first-load');
    firstPage.style.transition='opacity 5.2s ease';
    setTimeout(()=>dotsContainer.classList.add('visible'), 3470);
    isAnimating = false;
  }, 7280);
});

// ---------- ドラッグ ----------
function startDrag(x){ if(isAnimating) return; isDragging=true; startX=x; lastX=x; lastTime=Date.now(); }
function drag(x){
  if(!isDragging||isAnimating) return;
  dragX=x-startX;
  if((currentPage===0&&dragX>0)||(currentPage===pages.length-1&&dragX<0)) dragX=0;
  const now=Date.now();
  velocity=(x-lastX)/(now-lastTime);
  lastX=x; lastTime=now;
  const ease=0.4;
  if(dragX<0&&currentPage<pages.length-1){
    pages[currentPage+1].style.opacity=Math.min(Math.abs(dragX)/pageWidth,1)*ease;
    pages[currentPage].style.opacity=1-Math.min(Math.abs(dragX)/pageWidth,1)*ease;
  } else if(dragX>0&&currentPage>0){
    pages[currentPage-1].style.opacity=Math.min(Math.abs(dragX)/pageWidth,1)*ease;
    pages[currentPage].style.opacity=1-Math.min(Math.abs(dragX)/pageWidth,1)*ease;
  }
}

function endDrag(){
  if(!isDragging||isAnimating) return;
  isDragging=false;
  let nextPage=null;
  const threshold=pageWidth*0.3;
  const velocityThreshold=0.3;
  if((dragX<-threshold||velocity<-velocityThreshold)&&currentPage<pages.length-1) nextPage=currentPage+1;
  else if((dragX>threshold||velocity>velocityThreshold)&&currentPage>0) nextPage=currentPage-1;

  if(nextPage!==null){
    isAnimating = true;
    pages.forEach(p=>{ p.style.opacity=''; });
    pages[currentPage].classList.remove('active');
    pages[nextPage].classList.add('active');
    setTimeout(()=>{ isAnimating = false; }, 3000);
    currentPage = nextPage;
  } else {
    pages[currentPage].style.opacity=1;
    if(dragX<0&&currentPage<pages.length-1) pages[currentPage+1].style.opacity=0;
    if(dragX>0&&currentPage>0) pages[currentPage-1].style.opacity=0;
  }
  dragX=0; velocity=0;
  updateDots();
}

function updateDots(){ dots.forEach((dot,i)=>dot.classList.toggle('active',i===currentPage)); }

// ---------- イベント ----------
wrapper.addEventListener('mousedown', e=>startDrag(e.pageX));
wrapper.addEventListener('touchstart', e=>startDrag(e.touches[0].pageX));
wrapper.addEventListener('mousemove', e=>drag(e.pageX));
wrapper.addEventListener('touchmove', e=>drag(e.touches[0].pageX));
wrapper.addEventListener('mouseup', endDrag);
wrapper.addEventListener('mouseleave', endDrag);
wrapper.addEventListener('touchend', endDrag);

// ページ内画像ドラッグ
document.querySelectorAll('.carousel-inner').forEach(inner=>{
  let isDrag=false, start, scrollLeft;
  inner.addEventListener('mousedown', e=>{ isDrag=true; inner.classList.add('dragging'); start=e.pageX-inner.offsetLeft; scrollLeft=inner.scrollLeft; });
  inner.addEventListener('mouseleave', ()=>{ isDrag=false; inner.classList.remove('dragging'); });
  inner.addEventListener('mouseup', ()=>{ isDrag=false; inner.classList.remove('dragging'); });
  inner.addEventListener('mousemove', e=>{ if(!isDrag) return; e.preventDefault(); inner.scrollLeft=scrollLeft+(start-(e.pageX-inner.offsetLeft)); });
  inner.addEventListener('touchstart', e=>{ isDrag=true; start=e.touches[0].pageX-inner.offsetLeft; scrollLeft=inner.scrollLeft; });
  inner.addEventListener('touchend', ()=>{ isDrag=false; });
  inner.addEventListener('touchmove', e=>{ if(!isDrag) return; inner.scrollLeft=scrollLeft+(start-(e.touches[0].pageX-inner.offsetLeft)); });
});

// 右クリック・長押し無効
document.addEventListener('contextmenu', e=>e.preventDefault());
document.addEventListener('touchmove', e=>{ if(e.touches.length>1) e.preventDefault(); }, {passive:false});
document.addEventListener('gesturestart', e=>e.preventDefault());