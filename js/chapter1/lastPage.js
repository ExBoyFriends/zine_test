export function initLastPage(topImg, nextBtn, getCurrentPage, pages){
  const maxShift = topImg.clientWidth/2;
  let isShifted=false;

  topImg.style.transform='translateX(0)'; // 初期中央
  topImg.addEventListener('click',()=>{
    if(getCurrentPage()!==pages.length-1) return;
    topImg.style.transition='transform 0.3s ease-out';
    if(!isShifted){
      topImg.style.transform=`translateX(${-maxShift}px)`;
      nextBtn.style.pointerEvents='auto';
    }else{
      topImg.style.transform='translateX(0)';
      nextBtn.style.pointerEvents='none';
    }
    isShifted=!isShifted;
  });
}