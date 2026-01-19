const pages = document.querySelectorAll('.carousel-page');
const dots = document.querySelectorAll('.dot');
const dotsContainer = document.querySelector('.dots');
let currentPage = 0;
let isDragging = false, dragX = 0, startX = 0, lastX = 0, lastTime = 0, velocity = 0, isAnimating = false;
const wrapper = document.querySelector('.carousel-wrapper');
const pageWidth = wrapper.clientWidth;
const loader = document.getElementById('loader');

/* 初回ロード */
window.addEventListener('load', ()=>{
  const firstPage = pages[0];
  isAnimating = true;

  firstPage.classList.add('first-load','active');
  loader.style.display='block';

  setTimeout(()=>{
    loader.style.display='none';
    firstPage.classList.remove('first-load');
    firstPage.style.transition='opacity 5.2s ease';
    setTimeout(()=>dotsContainer.classList.add('visible'), 1770);
    isAnimating = false;
  }, 7280);
});
