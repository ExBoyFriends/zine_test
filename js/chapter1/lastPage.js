export function initLastPage(lastImg, nextBtn, getCurrentPage, totalPages){
  let isShifted=false;
  const maxShift = lastImg.clientWidth/2;

  lastImg.addEventListener('click', ()=>{
    if(getCurrentPage()!==totalPages-1) return;
    lastImg.style.transition='transform 0.3s ease-out';

    if(!isShifted){
      lastImg.style.transform=`translateX(${-maxShift}px)`;
      nextBtn.style.pointerEvents='all';
      isShifted=true;
    } else {
      lastImg.style.transform='translateX(0)';
      nextBtn.style.pointerEvents='none';
      isShifted=false;
    }
  });

  nextBtn.addEventListener('click', ()=>window.location.href='chapter2.html');
}