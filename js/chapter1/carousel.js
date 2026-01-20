export function initCarousel(wrapper, pages) {
  let startX = 0;
  let currentPage = 0;
  let isDragging = false;
  let dragX = 0, lastX = 0, lastTime = 0, velocity = 0;
  let isAnimating = false;
  const pageWidth = wrapper.clientWidth;

  function showPage(index) {
    pages[currentPage].classList.remove('active');
    pages[index].classList.add('active');
    currentPage = index;
    updateDots();
  }

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if(i===0||i===dots.length-1) return;
      dot.classList.toggle('active', i===currentPage+1);
    });
    dots[0].style.opacity = (currentPage===0)?0:1;
    dots[dots.length-1].style.opacity = (currentPage===pages.length-1)?0:1;
  }

  wrapper.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; });
  wrapper.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(dx<-60 && currentPage<pages.length-1) showPage(currentPage+1);
    if(dx>60 && currentPage>0) showPage(currentPage-1);
  });

  return { getCurrentPage: ()=>currentPage };
}