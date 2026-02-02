// carousel.js

export function initCarousel(wrapper, pages) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const threshold = () => wrapper.clientWidth * 0.25;

  updateDots();
  normalize();

  function updateDots() {
    document.querySelectorAll('.dot')
      .forEach((d,i)=>d.classList.toggle('active', i===currentPage));
  }

  const inner = p => p.querySelector('.carousel-inner');

  wrapper.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    currentX = 0;

    pages.forEach(p => {
      p.style.transition = 'none';
      inner(p).style.transition = 'none';
    });

    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    currentX = dx;

    const w = wrapper.clientWidth;
    const r = Math.min(Math.abs(dx)/w,1);

    const cur = pages[currentPage];
    cur.style.opacity = 1 - r;
    inner(cur).style.transform = `translateX(${dx}px)`;

    if (dx < 0 && pages[currentPage+1]) {
      const next = pages[currentPage+1];
      next.style.opacity = r;
      inner(next).style.transform = `translateX(${dx+w}px)`;
    }

    if (dx > 0 && pages[currentPage-1]) {
      const prev = pages[currentPage-1];
      prev.style.opacity = r;
      inner(prev).style.transform = `translateX(${dx-w}px)`;
    }
  });

  wrapper.addEventListener('pointerup', finish);
  wrapper.addEventListener('pointercancel', finish);

  function finish(e) {
    if (!isDragging) return;
    isDragging = false;
    wrapper.releasePointerCapture(e.pointerId);

    if (currentX < -threshold() && pages[currentPage+1]) currentPage++;
    if (currentX > threshold() && pages[currentPage-1]) currentPage--;

    updateDots();
    normalize();
  }

  function normalize() {
    pages.forEach((p,i)=>{
      p.style.transition = 'opacity .8s ease';
      p.style.opacity = i===currentPage?1:0;
      p.classList.toggle('active', i===currentPage);
      inner(p).style.transition = 'transform .8s ease';
      inner(p).style.transform = 'translateX(0)';
    });
  }

  return { getCurrentPage:()=>currentPage };
}

