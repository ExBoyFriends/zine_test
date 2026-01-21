export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let isAnimating = false;
  let isLocked = false;

  let startX = 0;
  let dragX = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;

  const pageWidth = () => wrapper.clientWidth;

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });
    dots[0] && (dots[0].style.opacity = currentPage === 0 ? 0 : 1);
  }

  pages.forEach((p, i) => {
    p.classList.toggle('active', i === 0);
    p.style.opacity = i === 0 ? '1' : '0';
  });
  updateDots();

  function onPointerDown(e) {
    if (isAnimating || isLocked) return;
    isDragging = true;
    startX = e.clientX;
    dragX = 0;
    lastX = e.clientX;
    lastTime = performance.now();
    wrapper.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDragging || isAnimating || isLocked) return;

    const x = e.clientX;
    dragX = x - startX;

    const now = performance.now();
    velocity = (x - lastX) / (now - lastTime);
    lastX = x;
    lastTime = now;

    if (dragX < 0 && currentPage < pages.length - 1) {
      const r = Math.min(Math.abs(dragX) / pageWidth(), 1);
      pages[currentPage + 1].style.opacity = r;
      pages[currentPage].style.opacity = 1 - r;
    }

    if (dragX > 0 && currentPage > 0) {
      const r = Math.min(dragX / pageWidth(), 1);
      pages[currentPage - 1].style.opacity = r;
      pages[currentPage].style.opacity = 1 - r;
    }
  }

  function onPointerUp() {
    if (!isDragging || isAnimating || isLocked) return;
    isDragging = false;

    let next = null;
    const threshold = pageWidth() * 0.25;

    if (dragX < -threshold && currentPage < pages.length - 1)
      next = currentPage + 1;
    if (dragX > threshold && currentPage > 0)
      next = currentPage - 1;

    if (next !== null) {
      isAnimating = true;
      pages[currentPage].classList.remove('active');
      pages[next].classList.add('active');
      currentPage = next;

      pages.forEach((p, i) => {
        p.style.opacity = i === currentPage ? '1' : '0';
      });

      setTimeout(() => (isAnimating = false), 1400);
    } else {
      pages.forEach((p, i) => {
        p.style.opacity = i === currentPage ? '1' : '0';
      });
    }

    dragX = velocity = 0;
    updateDots();
  }

  wrapper.addEventListener('pointerdown', onPointerDown);
  wrapper.addEventListener('pointermove', onPointerMove);
  wrapper.addEventListener('pointerup', onPointerUp);
  wrapper.addEventListener('pointercancel', onPointerUp);

  return {
    getCurrentPage: () => currentPage,
    lock: v => (isLocked = v)
  };
}


