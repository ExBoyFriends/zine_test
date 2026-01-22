export function initCarousel(wrapper, pages) {
  let current = 0;
  let startX = 0;
  let dx = 0;
  let dragging = false;

  const threshold = () => wrapper.clientWidth * 0.25;

  function updateDots() {
    document.querySelectorAll('.dot').forEach((d, i) => {
      if (i === 0 || i === 6) return;
      d.classList.toggle('active', i === current + 1);
    });
  }

  wrapper.addEventListener('pointerdown', e => {
    dragging = true;
    startX = e.clientX;
    dx = 0;
  });

  wrapper.addEventListener('pointermove', e => {
    if (!dragging) return;
    dx = e.clientX - startX;
    const inner = pages[current].querySelector('.carousel-inner');
    inner.style.transform = `translateX(${dx}px)`;
  });

  wrapper.addEventListener('pointerup', () => {
    dragging = false;
    let next = null;

    if (dx < -threshold() && current < pages.length - 1) next = current + 1;
    if (dx > threshold() && current > 0) next = current - 1;

    pages[current].querySelector('.carousel-inner').style.transform = '';

    if (next !== null) {
      pages[current].classList.remove('active');
      pages[next].classList.add('active');
      current = next;
      updateDots();
    }
  });

  return {
    getCurrentPage: () => current
  };
}

