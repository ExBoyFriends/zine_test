export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let startX = 0;
  let dragX = 0;
  let isDragging = false;
  let isAnimating = false;

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });
    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  updateDots();

  function goTo(index) {
    if (index === currentPage || isAnimating) return;
    if (index < 0 || index >= pages.length) return;

    isAnimating = true;
    pages[currentPage].classList.remove('active');
    pages[index].classList.add('active');
    currentPage = index;

    setTimeout(() => isAnimating = false, 1400);
    updateDots();
  }

  wrapper.addEventListener('pointerdown', e => {
    if (wrapper.dataset.lock === 'true') return;
    isDragging = true;
    startX = e.clientX;
    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointermove', e => {
    if (!isDragging || isAnimating) return;
    dragX = e.clientX - startX;
  });

  wrapper.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;

    const threshold = wrapper.clientWidth * 0.25;

    if (dragX < -threshold) goTo(currentPage + 1);
    if (dragX > threshold) goTo(currentPage - 1);

    dragX = 0;
  });

  return {
    getCurrentPage: () => currentPage,
    lock: v => wrapper.dataset.lock = v ? 'true' : 'false'
  };
}



