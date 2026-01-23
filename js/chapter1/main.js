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

// 右クリック無効
document.addEventListener('contextmenu', e => e.preventDefault());

// ピンチズーム無効（iOS）
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());

// ダブルタップズーム無効
let lastTouch = 0;
wrapper.addEventListener(
  'touchend',
  e => {
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  },
  { passive: false }
);

// URLバー対策
const hideURLBar = () => {
  if (window.matchMedia('(orientation: landscape)').matches) {
    window.scrollTo(0, 1);
  }
};

['orientationchange', 'resize', 'visibilitychange'].forEach(event => {
  window.addEventListener(event, () => {
    setTimeout(hideURLBar, 300);
  });
});

// vh対策
function setVh() {
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  );
}

setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);

