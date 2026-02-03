
// chapter1/carousel.js
import { state } from "../utils/state.js";

export function initCarousel(wrapper, pages) {
  let currentPage = state.index ?? 0;

  function getInner(page) {
    return page.querySelector(".carousel-inner");
  }

  function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentPage);
    });
  }

  function normalize() {
    pages.forEach((p, i) => {
      p.style.transition = "opacity .6s ease";
      p.style.opacity = i === currentPage ? 1 : 0;

      const inner = getInner(p);
      if (inner) {
        inner.style.transition = "transform .6s ease";
        inner.style.transform = "translateX(0)";
      }
    });

    updateDots();
  }

  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  wrapper.addEventListener("pointerdown", start);
  wrapper.addEventListener("pointermove", move);
  wrapper.addEventListener("pointerup", end);
  wrapper.addEventListener("pointercancel", end);

  // Safari fallback
  wrapper.addEventListener("touchstart", start);
  wrapper.addEventListener("touchmove", move);
  wrapper.addEventListener("touchend", end);

  function start(e) {
    isDragging = true;
    startX = e.clientX ?? e.touches[0].clientX;
    currentX = 0;

    pages.forEach(p => {
      p.style.transition = "none";
      const inner = getInner(p);
      if (inner) inner.style.transition = "none";
    });

    if (e.pointerId) wrapper.setPointerCapture(e.pointerId);
  }

  function move(e) {
    if (!isDragging) return;

    const x = e.clientX ?? e.touches[0].clientX;
    const dx = x - startX;
    currentX = dx;

    const width = wrapper.clientWidth;
    const r = Math.min(Math.abs(dx) / width, 1);

    pages.forEach(p => (p.style.opacity = 0));

    const current = pages[currentPage];
    current.style.opacity = 1 - r;
    getInner(current).style.transform = `translateX(${dx}px)`;

    if (dx < 0 && pages[currentPage + 1]) {
      const next = pages[currentPage + 1];
      next.style.opacity = r;
      getInner(next).style.transform = `translateX(${dx + width}px)`;
    }

    if (dx > 0 && pages[currentPage - 1]) {
      const prev = pages[currentPage - 1];
      prev.style.opacity = r;
      getInner(prev).style.transform = `translateX(${dx - width}px)`;
    }
  }

  function end(e) {
    if (!isDragging) return;
    isDragging = false;

    const width = wrapper.clientWidth;
    const threshold = width * 0.25;

    if (currentX < -threshold && currentPage < pages.length - 1) {
      currentPage++;
    }
    if (currentX > threshold && currentPage > 0) {
      currentPage--;
    }

    state.prevIndex = state.index;
    state.index = currentPage;

    normalize();

    if (e.pointerId) wrapper.releasePointerCapture(e.pointerId);
  }

  normalize();

  return {
    getCurrentPage: () => currentPage
  };
}


