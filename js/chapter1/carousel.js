export function initCarousel(wrapper, pages) {
  let startX = 0;
  let currentPage = 0;
  let isDragging = false;
  let dragX = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let isAnimating = false;

  const pageWidth = wrapper.clientWidth;

  /* ===== ドット更新 ===== */
  function updateDots() {
    const dots = document.querySelectorAll('.dot');

    dots.forEach((dot, i) => {
      // 左右三角は除外
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });

    // 左三角の表示制御
    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  updateDots();

  /* ===== ドラッグ開始 ===== */
  function startDrag(x) {
    if (isAnimating) return;

    // 最後ページではカルーセルドラッグしない
    if (currentPage === pages.length - 1) return;

    isDragging = true;
    dragX = 0;
    startX = x;
    lastX = x;
    lastTime = Date.now();
  }

  /* ===== ドラッグ中 ===== */
  function drag(x) {
    if (!isDragging || isAnimating) return;

    dragX = x - startX;

    const now = Date.now();
    velocity = (x - lastX) / (now - lastTime);
    lastX = x;
    lastTime = now;

    // 次ページへ
    if (dragX < 0 && currentPage < pages.length - 1) {
      const ratio = Math.min(Math.abs(dragX) / pageWidth, 1);
      pages[currentPage + 1].style.opacity = ratio;
      pages[currentPage].style.opacity = 1 - ratio;
    }
    // 前ページへ
    else if (dragX > 0 && currentPage > 0) {
      const ratio = Math.min(Math.abs(dragX) / pageWidth, 1);
      pages[currentPage - 1].style.opacity = ratio;
      pages[currentPage].style.opacity = 1 - ratio;
    }
  }

  /* ===== ドラッグ終了 ===== */
  function endDrag() {
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
    } else if (
      (dragX > threshold || velocity > velocityThreshold) &&
      currentPage > 0
    ) {
      nextPage = currentPage - 1;
    }

    if (nextPage !== null) {
      isAnimating = true;

      pages[currentPage].classList.remove('active');
      pages[nextPage].classList.add('active');

      pages.forEach(p => (p.style.opacity = ''));
      currentPage = nextPage;

      setTimeout(() => {
        isAnimating = false;
      }, 1400);
    } else {
      // 元のページに戻す
      pages.forEach((p, i) => {
        p.style.opacity = i === currentPage ? 1 : 0;
      });
    }

    dragX = 0;
    velocity = 0;
    updateDots();
  }

  /* ===== Pointer Events ===== */
  wrapper.addEventListener('pointerdown', e => {
    wrapper.setPointerCapture(e.pointerId);
    startDrag(e.clientX);
  });

  wrapper.addEventListener('pointermove', e => {
    if (!isDragging) return;
    drag(e.clientX);
  });

  wrapper.addEventListener('pointerup', () => {
    endDrag();
  });

  wrapper.addEventListener('pointercancel', () => {
    endDrag();
  });

  return {
    getCurrentPage: () => currentPage
  };
}




