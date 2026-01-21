export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let dragX = 0;
  let isAnimating = false;

  const pageWidth = () => wrapper.clientWidth;

  pages[0].classList.add('active');
  updateDots();

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });
  }

  pages.forEach((page, index) => {
    const inner = page.querySelector('.carousel-inner');
    if (!inner) return;

    inner.addEventListener('pointerdown', e => {
      if (isAnimating || index !== currentPage) return;

      isDragging = true;
      startX = e.clientX;
      dragX = 0;

      inner.setPointerCapture(e.pointerId);
      inner.classList.add('dragging');
    });

    inner.addEventListener('pointermove', e => {
      if (!isDragging || isAnimating) return;

      dragX = e.clientX - startX;

      if (currentPage === pages.length - 1 && dragX < 0) return;

      if (dragX < 0 && currentPage < pages.length - 1) {
        const r = Math.min(Math.abs(dragX) / pageWidth(), 1);
        pages[currentPage + 1].style.opacity = r;
        page.style.opacity = 1 - r;
      }

      if (dragX > 0 && currentPage > 0) {
        const r = Math.min(Math.abs(dragX) / pageWidth(), 1);
        pages[currentPage - 1].style.opacity = r;
        page.style.opacity = 1 - r;
      }
    });

    inner.addEventListener('pointerup', e => {
      if (!isDragging) return;

      isDragging = false;
      inner.releasePointerCapture(e.pointerId);
      inner.classList.remove('dragging');

      const threshold = pageWidth() * 0.25;
      let next = null;

      if (dragX < -threshold && currentPage < pages.length - 1) {
        next = currentPage + 1;
      }
      if (dragX > threshold && currentPage > 0) {
        next = currentPage - 1;
      }

      pages.forEach(p => (p.style.opacity = ''));

      if (next !== null) {
        isAnimating = true;
        pages[currentPage].classList.remove('active');
        pages[next].classList.add('active');
        currentPage = next;
        updateDots();

        setTimeout(() => (isAnimating = false), 1400);
      }
    });

    inner.addEventListener('pointercancel', () => {
      isDragging = false;
      inner.classList.remove('dragging');
    });
  });

  return {
    getCurrentPage: () => currentPage
  };
}
