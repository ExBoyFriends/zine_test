export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const threshold = () => wrapper.clientWidth * 0.25;

  updateDots();
  normalize();

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });
    if (dots[0]) dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  function getInner(page) {
    return page.querySelector('.carousel-inner');
  }

  /* =====================
     pointer down
  ===================== */
  wrapper.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;

    const inner = getInner(pages[currentPage]);
    if (!inner) return;

    isDragging = true;
    startX = e.clientX;
    currentX = 0;

    // フェード中でも即操作可能
    pages.forEach(p => {
      p.style.transition = 'none';
      const i = getInner(p);
      if (i) i.style.transition = 'none';
    });

    wrapper.setPointerCapture(e.pointerId);
  });

  /* =====================
     pointer move
  ===================== */
  wrapper.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    currentX = dx;

    const width = wrapper.clientWidth;
    const r = Math.min(Math.abs(dx) / width, 1);

    pages.forEach(p => (p.style.opacity = 0));

    const current = pages[currentPage];
    const currentInner = getInner(current);

    current.style.opacity = 1 - r;
    currentInner.style.transform = `translateX(${dx}px)`;

    if (dx < 0 && pages[currentPage + 1]) {
      const next = pages[currentPage + 1];
      next.style.opacity = r;
      getInner(next).style.transform =
        `translateX(${dx + width}px)`;
    }

    if (dx > 0 && pages[currentPage - 1]) {
      const prev = pages[currentPage - 1];
      prev.style.opacity = r;
      getInner(prev).style.transform =
        `translateX(${dx - width}px)`;
    }
  });

  /* =====================
     pointer up / cancel
  ===================== */
  wrapper.addEventListener('pointerup', finish);
  wrapper.addEventListener('pointercancel', finish);

  function finish(e) {
    if (!isDragging) return;
    isDragging = false;

    const dx = currentX;
    let next = currentPage;

    if (dx < -threshold() && currentPage < pages.length - 1) next++;
    if (dx > threshold() && currentPage > 0) next--;

    currentPage = next;
    updateDots();
    normalize();

    wrapper.releasePointerCapture(e.pointerId);
  }

  /* =====================
     normalize（静止状態）
  ===================== */
  function normalize() {
    pages.forEach((p, i) => {
      p.style.transition = 'opacity .8s ease';
      p.style.opacity = i === currentPage ? 1 : 0;
      p.classList.toggle('active', i === currentPage);

      const inner = getInner(p);
      if (inner) {
        inner.style.transition = 'transform .8s ease';
        inner.style.transform = 'translateX(0)';
      }
    });
  }

  return {
    getCurrentPage: () => currentPage
  };
}

