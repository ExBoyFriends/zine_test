export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;

  let startX = 0;
  let startOffset = 0;
  let dragOffset = 0;

  const pageWidth = () => wrapper.clientWidth;

  pages[0].classList.add('active');
  updateDots();

  function updateDots() {
    const dots = document.querySelectorAll('.dot');

    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });

    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  pages.forEach((page, index) => {
    const inner = page.querySelector('.carousel-inner');
    if (!inner) return;

    inner.addEventListener('pointerdown', e => {
      if (!page.classList.contains('active')) return;

      isDragging = true;
      startX = e.clientX;
      startOffset = 0;
      dragOffset = 0;

      inner.style.cursor = 'grabbing';
      inner.setPointerCapture(e.pointerId);
    });

    inner.addEventListener('pointermove', e => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      dragOffset = startOffset + dx;

      // 最終ページはここでは制御しない
      if (currentPage === pages.length - 1) return;

      if (dragOffset < 0 && currentPage < pages.length - 1) {
        const r = Math.min(Math.abs(dragOffset) / pageWidth(), 1);
        pages[currentPage + 1].style.opacity = r;
        pages[currentPage].style.opacity = 1 - r;
      }

      if (dragOffset > 0 && currentPage > 0) {
        const r = Math.min(Math.abs(dragOffset) / pageWidth(), 1);
        pages[currentPage - 1].style.opacity = r;
        pages[currentPage].style.opacity = 1 - r;
      }
    });

    inner.addEventListener('pointerup', e => {
      if (!isDragging) return;

      isDragging = false;
      inner.releasePointerCapture(e.pointerId);
      inner.style.cursor = 'grab';

      let next = null;
      const threshold = pageWidth() * 0.25;

      if (dragOffset < -threshold && currentPage < pages.length - 1) {
        next = currentPage + 1;
      }
      if (dragOffset > threshold && currentPage > 0) {
        next = currentPage - 1;
      }

      pages.forEach(p => (p.style.opacity = ''));

      if (next !== null) {
        pages[currentPage].classList.remove('active');
        pages[next].classList.add('active');
        currentPage = next;
        updateDots();
      }
    });

    inner.addEventListener('pointercancel', () => {
      isDragging = false;
      pages.forEach(p => (p.style.opacity = ''));
    });
  });

  return {
    getCurrentPage: () => currentPage
  };
}

