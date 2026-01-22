export function initCarousel(wrapper, pages, dots) {
  let current = 0;
  let startX = 0;
  let dragging = false;

  const width = () => window.innerWidth;

  const update = (animate = true) => {
    wrapper.style.transition = animate
      ? 'transform 0.8s ease-out'
      : 'none';

    wrapper.style.transform =
      `translateX(${-current * width()}px)`;

    pages.forEach((p, i) =>
      p.classList.toggle('active', i === current)
    );

    dots.forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  };

  update(true);

  wrapper.addEventListener('pointerdown', e => {
    if (current === pages.length - 1) return;

    dragging = true;
    startX = e.clientX;
    wrapper.style.transition = 'none';
  });

  wrapper.addEventListener('pointermove', e => {
    if (!dragging) return;

    const dx = e.clientX - startX;

    // ★ 流れるだけ（反発なし）
    wrapper.style.transform =
      `translateX(${-current * width() + dx * 0.25}px)`;
  });

  wrapper.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;

    const dx = e.clientX - startX;
    const threshold = width() * 0.2;

    if (dx < -threshold && current < pages.length - 1) current++;
    else if (dx > threshold && current > 0) current--;

    update(true);
  });

  wrapper.addEventListener('pointercancel', () => {
    dragging = false;
    update(true);
  });

  return () => current;
}

