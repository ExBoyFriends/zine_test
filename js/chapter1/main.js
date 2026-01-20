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

const carousel = initCarousel(wrapper, pages, dots);

initLastPage(lastImg, nextBtn, carousel.getCurrentPage, pages.length);