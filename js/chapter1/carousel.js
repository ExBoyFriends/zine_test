export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let startX = 0;
  let isDragging = false;

  const width = wrapper.clientWidth;

  function showPage(index) {
    pages.forEach((p, i) => {
      p.classList.toggle('active', i === index);
    });
  }

  wrapper.addEventListener('pointerdown', e => {
    isDragging = true;
    startX = e.clientX;
    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;

    const dx = e.clientX - startX;

    if (dx < -width * 0.25 && currentPage < pages.length - 1) {
      currentPage++;
    } else if (dx > width * 0.25 && currentPage > 0) {
      currentPage--;
    }

    showPage(currentPage);
  });

  showPage(0);

  return {
    getCurrentPage: () => currentPage
  };
}
