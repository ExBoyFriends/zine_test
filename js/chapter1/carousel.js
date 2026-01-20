export function initCarousel(wrapper, pages, dots){
  let currentPage=0, isDragging=false, startX=0, lastX=0, lastTime=0, velocity=0, dragX=0, isAnimating=false;
  const pageWidth = wrapper.clientWidth;

  function showPage(index){
    if(index<0||index>=pages.length) return;
    pages[currentPage].classList.remove('active');
    dots[currentPage].classList.remove('active');
    pages[index].classList.add('active');
    dots[index].classList.add('active');
    currentPage=index;
  }

  function startDrag(x){ if(isAnimating) return; isDragging=true; startX=x; lastX=x; lastTime=Date.now();}
  function drag(x){
    if(!isDragging||isAnimating) return;
    dragX=x-startX;
    const now=Date.now();
    velocity=(x-lastX)/(now-lastTime);
    lastX=x; lastTime=now;

    if(currentPage===pages.length-1) return; // 最後ページはドラッグ無効

    const ease=0.4;
    if(dragX<0 && currentPage<pages.length-1){
      pages[currentPage+1].style.opacity=Math.min(Math.abs(dragX)/pageWidth,1)*ease;
      pages[currentPage].style.opacity=1-Math.min(Math.abs(dragX)/pageWidth,1)*ease;
    }else if(dragX>0 && currentPage>0){
      pages[currentPage-1].style.opacity=Math.min(Math.abs(dragX)/pageWidth,1)*ease;
      pages[currentPage].style.opacity=1-Math.min(Math.abs(dragX)/pageWidth,1)*ease;
    }
  }

  function endDrag(){
    if(!isDragging||isAnimating) return;
    isDragging=false;
    let nextPage=null;
    const threshold=pageWidth*0.25;
    const velocityThreshold=0.25;

    if((dragX<-threshold||velocity<-velocityThreshold)&&currentPage<pages.length-1) nextPage=currentPage+1;
    else if((dragX>threshold||velocity>velocityThreshold)&&currentPage>0) nextPage=currentPage-1;

    if(nextPage!==null){
      isAnimating=true;
      pages.forEach(p=>p.style.opacity='');
      pages[currentPage].classList.remove('active');
      pages[nextPage].classList.add('active');
      setTimeout(()=>{isAnimating=false;},1400);
      currentPage=nextPage;
    }else{
      pages[currentPage].style.opacity=1;
      if(dragX<0 && currentPage<pages.length-1) pages[currentPage+1].style.opacity=0;
      if(dragX>0 && currentPage>0) pages[currentPage-1].style.opacity=0;
    }

    dragX=0; velocity=0;
  }

  wrapper.addEventListener('mousedown',e=>startDrag(e.pageX));
  wrapper.addEventListener('touchstart',e=>startDrag(e.touches[0].pageX));
  wrapper.addEventListener('mousemove',e=>drag(e.pageX));
  wrapper.addEventListener('touchmove',e=>drag(e.touches[0].pageX));
  wrapper.addEventListener('mouseup',endDrag);
  wrapper.addEventListener('mouseleave',endDrag);
  wrapper.addEventListener('touchend',endDrag);

  return { getCurrentPage:()=>currentPage };
}