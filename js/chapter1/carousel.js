export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let isAnimating = false;

  let startX = 0;
  let currentX = 0;

  const pageWidth = () => wrapper.clientWidth;

  /* ===== 初期表示 ===== */
  pages[0].classList.add('active');
  updateDots();

  /* ===== ドット ===== */
  function updateDots() {
    const dots = document.querySelectorAll('.dot');

    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });

    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  /* ===== Pointer ===== */
  wrapper.addEventListener('pointerdown', e => {
    if (isAnimating) return;

    isDragging = true;
    startX = e.clientX;
    currentX = 0;

    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointermove', e => {
    if (!isDragging || isAnimating) return;

    const dx = e.clientX - startX;
    currentX = dx;

    // 最終ページで左へ行くのは無効
    if (currentPage === pages.length - 1 && dx < 0) return;

    const r = Math.min(Math.abs(dx) / pageWidth(), 1);

    if (dx < 0 && currentPage < pages.length - 1) {
      pages[currentPage + 1].style.opacity = r;
      pages[currentPage].style.opacity = 1 - r;
    }

    if (dx > 0 && currentPage > 0) {
      pages[currentPage - 1].style.opacity = r;
      pages[currentPage].style.opacity = 1 - r;
    }
  });

  wrapper.addEventListener('pointerup', finishDrag);
  wrapper.addEventListener('pointercancel', finishDrag);

  function finishDrag(e) {
    if (!isDragging || isAnimating) return;

    isDragging = false;
    wrapper.releasePointerCapture(e.pointerId);

    const threshold = pageWidth() * 0.25;
    let next = null;

    if (currentX < -threshold && currentPage < pages.length - 1) {
      next = currentPage + 1;
    }
    if (currentX > threshold && currentPage > 0) {
      next = currentPage - 1;
    }

    pages.forEach(p => (p.style.opacity = ''));

    if (next !== null) {
      isAnimating = true;

      pages[currentPage].classList.remove('active');
      pages[next].classList.add('active');
      currentPage = next;
      updateDots();

      setTimeout(() => {
        isAnimating = false;
      }, 1400);
    }
  }

  return {
    getCurrentPage: () => currentPage
  };
}

