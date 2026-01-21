export function initCarousel(wrapper, pages) {
  let startX = 0,
      currentPage = 0,
      isDragging = false,
      dragX = 0,
      lastX = 0,
      lastTime = 0,
      velocity = 0,
      isAnimating = false;

  const pageWidth = wrapper.clientWidth;

  function showPage(index) {
    pages[currentPage].classList.remove('active');
    pages[index].classList.add('active');
    currentPage = index;
    updateDots();
  }

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });
    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  // ⭐ 初期状態を反映
  updateDots();

  // ===== ページ切替ドラッグ =====
  function startDrag(x) {
    if (isAnimating) return;
    isDragging = true;
    startX = x;
    lastX = x;
    lastTime = Date.now();
  }

  function drag(x) {
    if (!isDragging || isAnimating) return;
    dragX = x - startX;
    const now = Date.now();
    velocity = (x - lastX) / (now - lastTime);
    lastX = x;
    lastTime = now;

    if (dragX < 0 && currentPage < pages.length - 1) {
      const ratio = Math.min(Math.abs(dragX) / pageWidth, 1);
      pages[currentPage + 1].style.opacity = ratio;
      pages[currentPage].style.opacity = 1 - ratio;
    } else if (dragX > 0 && currentPage > 0) {
      const ratio = Math.min(Math.abs(dragX) / pageWidth, 1);
      pages[currentPage - 1].style.opacity = ratio;
      pages[currentPage].style.opacity = 1 - ratio;
    }
  }

  function endDrag() {
    if (!isDragging || isAnimating) return;
    isDragging = false;

    let nextPage = null;
    const threshold = pageWidth * 0.25;
    const velocityThreshold = 0.25;

    if ((dragX < -threshold || velocity < -velocityThreshold) && currentPage < pages.length - 1)
      nextPage = currentPage + 1;
    else if ((dragX > threshold || velocity > velocityThreshold) && currentPage > 0)
      nextPage = currentPage - 1;

    if (nextPage !== null) {
      isAnimating = true;
      pages[currentPage].classList.remove('active');
      pages[nextPage].classList.add('active');
      pages.forEach(p => (p.style.opacity = ''));
      setTimeout(() => (isAnimating = false), 1400);
      currentPage = nextPage;
    } else {
      pages.forEach((p, i) => {
        p.style.opacity = i === currentPage ? 1 : 0;
      });
    }

    dragX = 0;
    velocity = 0;
    updateDots();
  }

  // ===== イベント =====
  wrapper.addEventListener('mousedown', e => startDrag(e.pageX));
  wrapper.addEventListener('touchstart', e => startDrag(e.touches[0].pageX));
  wrapper.addEventListener('mousemove', e => drag(e.pageX));
  wrapper.addEventListener('touchmove', e => drag(e.touches[0].pageX));
  wrapper.addEventListener('mouseup', endDrag);
  wrapper.addEventListener('mouseleave', endDrag);
  wrapper.addEventListener('touchend', endDrag);

  // ===== ページ内スクロール用ドラッグ =====
  document.querySelectorAll('.carousel-inner').forEach(inner => {
    let isInnerDrag = false, start, scrollLeft;

    inner.addEventListener('mousedown', e => {
      isInnerDrag = true;
      inner.classList.add('dragging');
      start = e.pageX - inner.offsetLeft;
      scrollLeft = inner.scrollLeft;
    });

    inner.addEventListener('mousemove', e => {
      if (!isInnerDrag) return;
      e.preventDefault();
      inner.scrollLeft = scrollLeft + (start - (e.pageX - inner.offsetLeft));
    });

    inner.addEventListener('mouseup', () => {
      isInnerDrag = false;
      inner.classList.remove('dragging');
    });
    inner.addEventListener('mouseleave', () => {
      isInnerDrag = false;
      inner.classList.remove('dragging');
    });

    inner.addEventListener('touchstart', e => {
      isInnerDrag = true;
      start = e.touches[0].pageX - inner.offsetLeft;
      scrollLeft = inner.scrollLeft;
    });
    inner.addEventListener('touchmove', e => {
      if (!isInnerDrag) return;
      inner.scrollLeft = scrollLeft + (start - (e.touches[0].pageX - inner.offsetLeft));
    });
    inner.addEventListener('touchend', () => {
      isInnerDrag = false;
    });
  });

  // ✅ return は1回だけ
  return {
    getCurrentPage: () => currentPage
  };
}

