const pages = document.querySelectorAll('.carousel-page');
const dots = document.querySelectorAll('.dot');
const loader = document.getElementById('loader');

let currentPage = 0;
let isAnimating = false;

/* ローダー解除 */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    loader.style.display="none";
    updateDots();
  },2500);
});

/* ドット更新 */
function updateDots(){
  dots.forEach((d,i)=>{
    d.classList.toggle("active",i===currentPage);
  });
}

/* 最後ページスライド */
const lastImg = document.querySelector('.last-img.top');
const nextBtnWrapper = document.querySelector('.next-btn-wrapper');

let maxShift = 0;
let isShifted = false;

if(lastImg){
  if(lastImg.complete){
    maxShift = lastImg.clientWidth/2;
  }else{
    lastImg.onload = ()=> maxShift = lastImg.clientWidth/2;
  }

  lastImg.addEventListener('click',()=>{
    if(currentPage !== pages.length-1) return;

    if(!isShifted){
      lastImg.style.transform = `translateX(-${maxShift}px)`;
      isShifted = true;
      nextBtnWrapper.classList.add('show');
    }else{
      lastImg.style.transform = `translateX(0px)`;
      isShifted = false;
      nextBtnWrapper.classList.remove('show');
    }
  });
}

/* 簡易ページ遷移（左右タップで動く仮仕様）*/
document.addEventListener('click',(e)=>{
  if(isAnimating) return;
  if(e.clientX < window.innerWidth/2){
    if(currentPage>0){
      pages[currentPage].classList.remove('active');
      currentPage--;
      pages[currentPage].classList.add('active');
      updateDots();
    }
  }else{
    if(currentPage<pages.length-1){
      pages[currentPage].classList.remove('active');
      currentPage++;
      pages[currentPage].classList.add('active');
      updateDots();
    }
  }
});