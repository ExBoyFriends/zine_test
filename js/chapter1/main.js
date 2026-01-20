import { initLoader } from './loader.js';
import { initCarousel } from './carousel.js';
import { initLastPage } from './lastPage.js';

const pages = document.querySelectorAll('.carousel-page');
const loader = document.getElementById('loader');
const wrapper = document.querySelector('.carousel-wrapper');
const lastImg = document.querySelector('.last-img.top');
const nextBtn = document.getElementById('next-chapter-btn');
const dotsContainer = document.querySelector('.dots');

initLoader(pages, loader, dotsContainer);
const carousel = initCarousel(wrapper, pages);
initLastPage(lastImg, nextBtn, carousel.getCurrentPage, pages.length);