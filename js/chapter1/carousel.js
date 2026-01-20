// carousel.js
export function initCarousel(wrapper, pages) {
  let startX = 0;
  let currentPage = 0;

  function showPage(index) {
    pages[currentPage].classList.remove("active");
    pages[index].classList.add("active");
    currentPage = index;
  }

  wrapper.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  wrapper.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;

    if (dx < -60 && currentPage < pages.length - 1) {
      showPage(currentPage + 1);
    }

    if (dx > 60 && currentPage > 0) {
      showPage(currentPage - 1);
    }
  });

  return {
    getCurrentPage: () => currentPage
  };
}