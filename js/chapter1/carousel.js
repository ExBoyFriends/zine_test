export function initCarousel(wrapper, pages, dots) {
  let startX = 0;
  let currentPage = 0;
  let isDragging = false;

  function showPage(index) {
    if(index<0 || index>=pages.length) return;
    pages[currentPage].classList.remove("active");
    dots[currentPage].classList.remove("active");
    pages[index].classList.add("active");
    dots[index].classList.add("active");
    currentPage = index;
  }

  wrapper.addEventListener("touchstart", e=>{
    if(currentPage === pages.length-1) return; // 最後ページはドラッグ無効
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  wrapper.addEventListener("touchmove", e=>{
    if(!isDragging) return;
  });

  wrapper.addEventListener("touchend", e=>{
    if(!isDragging) return;
    const dx = e.changedTouches[0].clientX - startX;
    if(dx<-50 && currentPage < pages.length-1) showPage(currentPage+1);
    if(dx>50 && currentPage >0) showPage(currentPage-1);
    isDragging = false;
  });

  return {
    getCurrentPage: ()=>currentPage
  };
}