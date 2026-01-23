export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let isSettling = false; // ← ページ確定中のみロック

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
    if (isSettling) return;

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
    if (!isDragging) return;

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
    if (!isDragging) return;
    isDragging = false;

    const dx = currentX;
    const page = pages[currentPage];
    const inner = getInner(page);

    inner.classList.remove('dragging');

    let next = null;
    if (dx < -threshold() && currentPage < pages.length - 1) {
      next = currentPage + 1;
    }
    if (dx > threshold() && currentPage > 0) {
      next = currentPage - 1;
    }

    pages.forEach(p => (p.style.opacity = ''));

   // ▶︎ ページ切り替え
if (next !== null) {
  isSettling = true;

  const ratio = Math.min(Math.abs(dx) / wrapper.clientWidth, 1);
  const duration = 1.6 + ratio * 1.8;

  pages[currentPage].style.transition = `opacity ${duration}s ease`;
  pages[next].style.transition = `opacity ${duration}s ease`;

  const prev = currentPage;
  currentPage = next;
  updateDots();

  setTimeout(() => {
    pages[prev].classList.remove('active');
    pages[currentPage].classList.add('active');

    pages.forEach(p => (p.style.transition = ''));
    isSettling = false;
  }, duration * 1000);

    // ▶︎ 戻るとき（弾性）
    } else {
      inner.style.transition =
        'transform 1.5s cubic-bezier(.16,1.25,.3,1)'; // ← ゆっくり
      inner.style.transform = 'translateX(0)';
    }

    wrapper.releasePointerCapture(e.pointerId);
  }

  return {
    getCurrentPage: () => currentPage
  };
}
