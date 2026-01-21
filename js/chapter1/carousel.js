export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let dragX = 0;
  let isAnimating = false;

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
    dragX = 0;

    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointermove', e => {
    if (!isDragging || isAnimating) return;

    dragX = e.clientX - startX;

    // 最終ページで「次へ」は無効
    if (currentPage === pages.length - 1 && dragX < 0) return;

    if (dragX < 0 && currentPage < pages.length - 1) {
      const r = Math.min(Math.abs(dragX) / pageWidth(), 1);
      pages[currentPage + 1].style.opacity = r;
      pages[currentPage].style.opacity = 1 - r;
    }

    if (dragX > 0 && currentPage > 0) {
      const r = Math.min(Math.abs(dragX) / pageWidth(), 1);
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

    let next = null;
    const threshold = pageWidth() * 0.25;

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

      setTimeout(() => {
        isAnimating = false;
      }, 1400);
    }
  }

  return {
    getCurrentPage: () => currentPage
  };
}


  return {
    getCurrentPage: () => currentPage
  };
}
