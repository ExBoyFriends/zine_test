export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

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

  wrapper.addEventListener('pointerdown', e => {
    isDragging = true;
    startX = e.clientX;
    currentX = 0;
    wrapper.style.transition = 'none';
    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    currentX = dx;

    const width = wrapper.clientWidth;
    wrapper.style.transform =
      `translateX(${-currentPage * width + dx}px)`;

    const r = Math.min(Math.abs(dx) / width, 1);

    pages.forEach(p => (p.style.opacity = 0));
    pages[currentPage].style.opacity = 1 - r;

    if (dx < 0 && pages[currentPage + 1]) {
      pages[currentPage + 1].style.opacity = r;
    }
    if (dx > 0 && pages[currentPage - 1]) {
      pages[currentPage - 1].style.opacity = r;
    }
  });

  wrapper.addEventListener('pointerup', finish);
  wrapper.addEventListener('pointercancel', finish);

  function finish(e) {
    if (!isDragging) return;
    isDragging = false;

    const dx = currentX;
    const width = wrapper.clientWidth;

    if (dx < -threshold() && currentPage < pages.length - 1) currentPage++;
    if (dx > threshold() && currentPage > 0) currentPage--;

    updateDots();

    wrapper.style.transition =
      'transform 0.6s cubic-bezier(.22,1,.36,1)';
    wrapper.style.transform =
      `translateX(${-currentPage * width}px)`;

    pages.forEach((p, i) => {
      p.style.opacity = i === currentPage ? 1 : 0;
    });

    wrapper.releasePointerCapture(e.pointerId);
  }

  return {
    getCurrentPage: () => currentPage
  };
}

