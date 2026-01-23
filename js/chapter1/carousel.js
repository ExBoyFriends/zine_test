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
    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  function getInner(page) {
    return page.querySelector('.carousel-inner');
  }

  /* =====================
     pointer down
  ===================== */
  wrapper.addEventListener('pointerdown', e => {
    const inner = getInner(pages[currentPage]);
    if (!inner) return;

    isDragging = true;
    startX = e.clientX;
    currentX = 0;

    pages.forEach(p => (p.style.transition = 'none'));
    inner.style.transition = 'none';

    wrapper.setPointerCapture(e.pointerId);
  });

  /* =====================
     pointer move（核心）
  ===================== */
  wrapper.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    currentX = dx;

    const width = wrapper.clientWidth;
    const progress = dx / width;

    // 帯を動かす
    getInner(pages[currentPage]).style.transform =
      `translateX(${dx}px)`;

    // フェードは位置で決める（アニメーションしない）
    pages.forEach((page, i) => {
      const dist = Math.abs(i - (currentPage - progress));
      page.style.opacity = Math.max(0, 1 - dist);
    });
  });

  /* =====================
     pointer up
  ===================== */
  wrapper.addEventListener('pointerup', finish);
  wrapper.addEventListener('pointercancel', finish);

  function finish(e) {
    if (!isDragging) return;
    isDragging = false;

    const dx = currentX;
    const width = wrapper.clientWidth;

    let next = currentPage;

    if (dx < -threshold() && currentPage < pages.length - 1) {
      next++;
    }
    if (dx > threshold() && currentPage > 0) {
      next--;
    }

    currentPage = next;
    updateDots();

    normalize();

    wrapper.releasePointerCapture(e.pointerId);
  }

  /* =====================
     見た目を正規化
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



  return {
    getCurrentPage: () => currentPage
  };
}
