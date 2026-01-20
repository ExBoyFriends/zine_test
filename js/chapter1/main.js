import { initLoader } from './loader.js';
import { initCarousel } from './carousel.js';
import { initLastPage } from './lastPage.js';

const pages=document.querySelectorAll('.carousel-page');
const dots=document.querySelectorAll('.dot');
const wrapper=document.querySelector('.carousel-wrapper');
const loader=document.getElementById('loader');
const lastImg=document.querySelector('.last-img.top');
const nextBtn=document.getElementById('next-chapter-btn');
const dotsContainer=document.querySelector('.dots');

initLoader(pages, loader, dotsContainer);
const carousel=initCarousel(wrapper, pages, dots);
initLastPage(lastImg, nextBtn, carousel.getCurrentPage, pages);

nextBtn.addEventListener('click',()=>{ window.location.href='chapter2.html'; });