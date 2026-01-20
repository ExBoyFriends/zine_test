const pages = document.querySelectorAll('.carousel-page');
const dots = document.querySelectorAll('.dot');
const loader = document.getElementById('loader');
const wrapper = document.querySelector('.carousel-wrapper');

const lastImg = document.querySelector('.last-img.top');
const nextBtnWrapper = document.querySelector('.next-btn-wrapper');

let currentPage = 0;
let isAnimating = false;

/* 初期表示 */
window.addEventListener('load', () => {
  pages[0].classList.add('active');
  setTimeout(() => {
    loader.style.display = 'none';
    updateDots();
  }, 1500);
});

/* ドット */
function updateDots() {
  dots.forEach((d,i)=>{
    d.classList.toggle('active', i === currentPage+1);
  });
}

/* ページ切り替え */
function goPage(index) {
  if (index < 0 || index >= pages.length) return;
  pages[currentPage].classList.remove('active');
  pages[index].classList.add('active');
  currentPage = index;
  updateDots();
}

/* 簡易左右タップ */
wrapper.addEventListener('click', e => {
  if (currentPage === pages.length - 1) return;
  const w = window.innerWidth;
  if (e.clientX < w/2) goPage(currentPage-1);
  else goPage(currentPage+1);
});

/* ---------- LAST IMAGE TAP ---------- */

let isShifted = false;
let maxShift = 0;

if (lastImg.complete) {
  maxShift = lastImg.clientWidth / 2;
} else {
  lastImg.onload = () => {
    maxShift = lastImg.clientWidth / 2;
  };
}

lastImg.addEventListener('click', e => {
  e.stopPropagation();
  if (currentPage !== pages.length - 1) return;

  if (!isShifted) {
    lastImg.style.transform = `translateX(${-maxShift}px)`;
    nextBtnWrapper.classList.add('show');
    isShifted = true;
  } else {
    lastImg.style.transform = `translateX(0px)`;
    nextBtnWrapper.classList.remove('show');
    isShifted = false;
  }
});