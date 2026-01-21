import { initLoader } from './loader.js';
import { initCarousel } from './carousel.js';
import { initLastPage } from './lastPage.js';

const pages = document.querySelectorAll('.carousel-page');
const wrapper = document.querySelector('.carousel-wrapper');
const loader = document.getElementById('loader');
const dots = document.querySelector('.dots');
const lastImg = document.querySelector('.last-img.top');

initLoader(pages, loader, dots);

const carousel = initCarousel(wrapper, pages);

initLastPage(
  lastImg,
  carousel,
  pages.length
);
