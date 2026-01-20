import { initLoader } from './loader.js';
import { initCarousel } from './carousel.js';
import { initLastPage } from './lastPage.js';

const pages=document.querySelectorAll('.carousel-page');
const dots=document.querySelectorAll('.dot');
const dotsContainer=document.querySelector('.dots');
const loader=document.getElementById('loader');
const wrapper=document.querySelector('.carousel-wrapper');
const lastImg=document.querySelector('.last-img.top');
const nextBtn=document.getElementById('next-chapter-btn');

initLoader(pages, loader, dotsContainer);

const carousel=initCarousel(wrapper,pages,dots);
initLastPage(lastImg,nextBtn,carousel.getCurrentPage,pages.length);

// ページ内スクロール
document.querySelectorAll('.carousel-inner').forEach(inner=>{
  let isDrag=false, startX=0, scrollLeft=0;

  inner.addEventListener('mousedown', e=>{
    isDrag=true; inner.classList.add('dragging');
    startX=e.pageX-inner.offsetLeft; scrollLeft=inner.scrollLeft;
  });
  inner.addEventListener('mouseleave', ()=>{
    isDrag=false; inner.classList.remove('dragging');
  });
  inner.addEventListener('mouseup', ()=>{
    isDrag=false; inner.classList.remove('dragging');
  });
  inner.addEventListener('mousemove', e=>{
    if(!isDrag) return; e.preventDefault();
    inner.scrollLeft=scrollLeft+(startX-(e.pageX-inner.offsetLeft));
  });

  inner.addEventListener('touchstart', e=>{
    isDrag=true; startX=e.touches[0].pageX-inner.offsetLeft; scrollLeft=inner.scrollLeft;
  });
  inner.addEventListener('touchmove', e=>{
    if(!isDrag) return;
    inner.scrollLeft=scrollLeft+(startX-(e.touches[0].pageX-inner.offsetLeft));
  });
  inner.addEventListener('touchend', ()=>{ isDrag=false; });
});