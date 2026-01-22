export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let isAnimating = false;

  const threshold = () => wrapper.clientWidth * 0.25;

  updateDots();

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });
    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  function getInner(page) {
    return page.querySelector('.carousel-inner');
  }

  wrapper.addEventListener('pointerdown', e => {
    if (isAnimating) return;

    const inner = getInner(pages[currentPage]);
    if (!inner) return;

    isDragging = true;
    startX = e.clientX;
    currentX = 0;

    inner.style.transition = 'none';
    inner.classList.add('dragging');
    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointermove', e => {
    if (!isDragging || isAnimating) return;

    const dx = e.clientX - startX;
    currentX = dx;

    const page = pages[currentPage];
    const inner = getInner(page);

    if (currentPage === pages.length - 1 && dx < 0) return;

    inner.style.transform = `translateX(${dx}px)`;

    const r = Math.min(Math.abs(dx) / wrapper.clientWidth, 1);

    if (dx < 0 && pages[currentPage + 1]) {
      pages[currentPage + 1].style.opacity = r;
      page.style.opacity = 1 - r;
    }

    if (dx > 0 && pages[currentPage - 1]) {
      pages[currentPage - 1].style.opacity = r;
      page.style.opacity = 1 - r;
    }
  });

  wrapper.addEventListener('pointerup', finish);
  wrapper.addEventListener('pointercancel', finish);

  function finish(e) {
    if (!isDragging || isAnimating) return;
    isDragging = false;

    const dx = currentX;
    const page = pages[currentPage];
    const inner = getInner(page);

    inner.classList.remove('dragging');
    inner.style.transition = 'transform 0.35s ease-out';
    inner.style.transform = 'translateX(0)';

    let next = null;
    if (dx < -threshold() && currentPage < pages.length - 1) next = currentPage + 1;
    if (dx > threshold() && currentPage > 0) next = currentPage - 1;

    pages.forEach(p => (p.style.opacity = ''));

    if (next !== null) {
      isAnimating = true;
      pages[currentPage].classList.remove('active');
      pages[next].classList.add('active');
      currentPage = next;
      updateDots();
      setTimeout(() => (isAnimating = false), 1400);
    }

    wrapper.releasePointerCapture(e.pointerId);
  }

  return {
    getCurrentPage: () => currentPage
  };
}

