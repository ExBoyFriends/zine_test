export function initCarousel(pages) {
  let currentPage = 0;
  let isAnimating = false;

  const inners = [...pages].map(p => p.querySelector('.carousel-inner'));

  /* ===== 初期表示 ===== */
  pages.forEach((p, i) => {
    p.classList.toggle('active', i === 0);
  });
  updateDots();

  /* ===== 各ページにドラッグ付与 ===== */
  inners.forEach((inner, index) => {
    setupDrag(inner, index);
  });

  /* ===== ドラッグロジック ===== */
  function setupDrag(inner, pageIndex) {
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    const width = () => inner.clientWidth;

    const setX = x => {
      inner.style.transform = `translateX(${x}px)`;
    };

    inner.addEventListener('pointerdown', e => {
      if (isAnimating) return;
      if (pageIndex !== currentPage) return;

      isDragging = true;
      startX = e.clientX;
      currentX = 0;

      inner.style.transition = 'none';
      inner.setPointerCapture(e.pointerId);
    });

    inner.addEventListener('pointermove', e => {
      if (!isDragging) return;

      const dx = e.clientX - startX;

      // 最終ページは「次へ」禁止
      if (pageIndex === pages.length - 1 && dx < 0) return;

      currentX = dx;
      setX(dx);
    });

    inner.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;

      inner.style.transition = 'transform 0.35s ease';

      const threshold = width() * 0.25;

      if (currentX < -threshold && currentPage < pages.length - 1) {
        goTo(currentPage + 1);
      } else if (currentX > threshold && currentPage > 0) {
        goTo(currentPage - 1);
      } else {
        setX(0);
      }

      currentX = 0;
    });

    inner.addEventListener('pointercancel', () => {
      isDragging = false;
      setX(0);
    });
  }

  /* ===== ページ切替 ===== */
  function goTo(next) {
    if (next === currentPage) return;

    isAnimating = true;

    const currentInner = inners[currentPage];
    const nextInner = inners[next];

    currentInner.style.transform = '';
    nextInner.style.transform = '';

    pages[currentPage].classList.remove('active');
    pages[next].classList.add('active');

    currentPage = next;
    updateDots();

    setTimeout(() => {
      isAnimating = false;
    }, 350);
  }

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

  return {
    getCurrentPage: () => currentPage
  };
}
