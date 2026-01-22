export function initCarousel(wrapper, pages, dots) {
  let current = 0;
  let startX = 0;
  let dragging = false;

  const update = () => {
    wrapper.style.transform = `translateX(${-current * 100}%)`;
    pages.forEach((p, i) => p.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current + 1));
  };

  update();

  wrapper.addEventListener('pointerdown', e => {
    dragging = true;
    startX = e.clientX;
    wrapper.style.transition = 'none';
  });

  wrapper.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    wrapper.style.transform =
      `translateX(${-current * window.innerWidth + dx * 0.3}px)`;
  });

  wrapper.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    wrapper.style.transition = 'transform 0.6s ease-out';

    const dx = e.clientX - startX;
    if (dx < -80 && current < pages.length - 1) current++;
    if (dx > 80 && current > 0) current--;

    update();
  });

  return () => current;
}

