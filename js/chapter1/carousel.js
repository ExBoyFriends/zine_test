export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let dragX = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let isAnimating = false;

  const pageWidth = wrapper.clientWidth;

  /* ===== ドット ===== */
  function updateDots() {
    const dots = document.querySelectorAll('.dot');

    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });

    if (dots[0]) {
      dots[0].style.opacity = currentPage === 0 ? 0 : 1;
    }
  }

  // 初期表示
  pages.forEach((p, i) => {
    p.classList.toggle('active', i === 0);
    p.style.opacity = i === 0 ? '1' : '0';
  });
  updateDots();

  /* ===== ドラッグ開始 ===== */
  function onPointerDown(e) {
    if (isAnimating) return;

    isDragging = true;
    startX = e.clientX;
    dragX = 0;
    lastX = e.clientX;
    lastTime = performance.now();

    wrapper.setPointerCapture(e.pointerId);
  }

  /* ===== ドラッグ中 ===== */
  function onPointerMove(e) {
    if (!isDragging || isAnimating) return;

    const x = e.clientX;
    dragX = x - startX;

    const now = performance.now();
    velocity = (x - lastX) / (now - lastTime);
    lastX = x;
    lastTime = now;

    // 次ページ（左）
    if (dragX < 0 && currentPage < pages.length - 1) {
      const ratio = Math.min(Math.abs(dragX) / pageWidth, 1);
      pages[currentPage + 1].style.opacity = ratio;
      pages[currentPage].style.opacity = 1 - ratio;
    }

    // 前ページ（右）
    if (dragX > 0 && currentPage > 0) {
      const ratio = Math.min(dragX / pageWidth, 1);
      pages[currentPage - 1].style.opacity = ratio;
      pages[currentPage].style.opacity = 1 - ratio;
    }
  }

  /* ===== ドラッグ終了 ===== */
  function onPointerUp() {
    if (!isDragging || isAnimating) return;
    isDragging = false;

    let nextPage = null;
    const threshold = pageWidth * 0.25;
    const velocityThreshold = 0.25;

    if (
      (dragX < -threshold || velocity < -velocityThreshold) &&
      currentPage < pages.length - 1
    ) {
      nextPage = currentPage + 1;
    }

    if (
      (dragX > threshold || velocity > velocityThreshold) &&
      currentPage > 0
    ) {
      nextPage = currentPage - 1;
    }

    if (nextPage !== null) {
      isAnimating = true;

      pages[currentPage].classList.remove('active');
      pages[nextPage].classList.add('active');
      currentPage = nextPage;

      pages.forEach((p, i) => {
        p.style.opacity = i === currentPage ? '1' : '0';
      });

      setTimeout(() => {
        isAnimating = false;
      }, 1400);
    } else {
      pages.forEach((p, i) => {
        p.style.opacity = i === currentPage ? '1' : '0';
      });
    }

    dragX = 0;
    velocity = 0;
    updateDots();
  }

  /* ===== イベント登録 ===== */
  wrapper.addEventListener('pointerdown', onPointerDown);
  wrapper.addEventListener('pointermove', onPointerMove);
  wrapper.addEventListener('pointerup', onPointerUp);
  wrapper.addEventListener('pointercancel', onPointerUp);

  return {
    getCurrentPage: () => currentPage
  };
}


