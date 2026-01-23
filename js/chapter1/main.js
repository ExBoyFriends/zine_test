import { initLoader } from './loader.js';
import { initCarousel } from './carousel.js';
import { initLastPage } from './lastPage.js';

const pages = document.querySelectorAll('.carousel-page');
const wrapper = document.querySelector('.carousel-wrapper');
const loader = document.getElementById('loader');
const dots = document.querySelector('.dots');
const lastWrapper = document.querySelector('.last-img-wrapper');

initLoader(pages, loader, dots);

const carousel = initCarousel(wrapper, pages);

initLastPage(
  lastWrapper,
  () => carousel.getCurrentPage(),
  pages.length
);

document.addEventListener('contextmenu', e => e.preventDefault());

const hideURLBar = () => {
  if (window.matchMedia('(orientation: landscape)').matches) {
    window.scrollTo(0, 1);
  }
};

window.addEventListener('orientationchange', () => {
  setTimeout(hideURLBar, 300);
});

window.addEventListener('resize', () => {
  setTimeout(hideURLBar, 300);
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    setTimeout(hideURLBar, 300);
  }
});
