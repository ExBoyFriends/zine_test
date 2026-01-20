export function initLastPage(lastImg, nextBtn, getCurrentPage, totalPages){
  const maxShift=lastImg.clientWidth/2;
  let isShifted=false;

  lastImg.style.transform='translateX(0)'; // 初期中央

  lastImg.addEventListener('click', ()=>{
    if(getCurrentPage()!==totalPages-1) return;

    lastImg.style.transition='transform 0.3s ease-out';

    if(!isShifted){
      lastImg.style.transform=`translateX(${-maxShift}px)`; // 左に半分
      isShifted=true;
      nextBtn.style.pointerEvents='all';
    } else {
      lastImg.style.transform='translateX(0)';
      isShifted=false;
      nextBtn.style.pointerEvents='none';
    }
  });

  nextBtn.addEventListener('click', ()=>{
    window.location.href='chapter2.html';
  });
}