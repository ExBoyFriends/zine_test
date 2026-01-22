import { initLoader } from './loader.js';
import { initCarousel } from './carousel.js';
import { initLastPage } from './lastPage.js';

const pages = document.querySelectorAll('.carousel-page');
const wrapper = document.querySelector('.carousel-wrapper');
const loader = document.getElementById('loader');
const dots = document.querySelectorAll('.dot');

initLoader(pages, loader, dots);
const getCurrent = initCarousel(wrapper, pages, dots);
initLastPage(getCurrent, pages.length);
