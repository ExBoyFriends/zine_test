export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let startX = 0;
  let dragX = 0;
  let isDragging = false;
  let isAnimating = false;

  function getActivePage() {
    return pages[currentPage];
  }

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });
    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  pages[0].classList.add('active');
  updateDots();

  function goTo(next) {
    if (isAnimating) return;
    if (next < 0 || next >= pages.length) return;

    isAnimating = true;

    pages[currentPage].classList.remove('active');
    pages[next].classList.add('active');
    currentPage = next;

    updateDots();

    setTimeout(() => {
      isAnimating = false;
    }, 1400);
  }

  /* ===== ドラッグ開始 ===== */
  pages.forEach(page => {
    page.addEventListener('pointerdown', e => {
      if (!page.classList.contains('active')) return;
      if (wrapper.dataset.lock === 'true') return;

      isDragging = true;
      startX = e.clientX;
      dragX = 0;

      page.setPointerCapture(e.pointerId);
    });

    page.addEventListener('pointermove', e => {
      if (!isDragging || isAnimating) return;
      dragX = e.clientX - startX;
    });

    page.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;

      const threshold = wrapper.clientWidth * 0.25;

      if (dragX < -threshold) goTo(currentPage + 1);
      else if (dragX > threshold) goTo(currentPage - 1);

      dragX = 0;
    });

    page.addEventListener('pointercancel', () => {
      isDragging = false;
      dragX = 0;
    });
  });

  return {
    getCurrentPage: () => currentPage,
    lock: v => wrapper.dataset.lock = v ? 'true' : 'false'
  };
}

  };
}



