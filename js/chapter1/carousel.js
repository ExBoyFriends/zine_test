// carousel.js

export function initCarousel(wrapper, pages, dots) {
  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let deltaX = 0;

  function update() {
    wrapper.style.transform = `translateX(${-currentPage * 100}%)`;
    updateDots();
  }

  function updateDots() {
    dots?.querySelectorAll("span").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentPage);
    });
  }

  /* =========================
     🚫 初期 normalize は呼ばない
  ========================= */

  function normalize() {
    pages.forEach((p, i) => {
      p.style.opacity = i === currentPage ? "1" : "0";
      p.classList.toggle("active", i === currentPage);
    });
  }

  function goTo(index) {
    currentPage = Math.max(0, Math.min(index, pages.length - 1));
    update();
    normalize();
  }

  /* ========== Drag ========== */

  function onStart(x) {
    isDragging = true;
    startX = x;
    deltaX = 0;
    wrapper.style.transition = "none";
  }

  function onMove(x) {
    if (!isDragging) return;
    deltaX = x - startX;
    wrapper.style.transform =
      `translateX(${(-currentPage * window.innerWidth + deltaX)}px)`;
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.transition = "";

    if (Math.abs(deltaX) > window.innerWidth * 0.2) {
      currentPage += deltaX < 0 ? 1 : -1;
      currentPage = Math.max(0, Math.min(currentPage, pages.length - 1));
    }

    update();
    normalize();
  }

  /* ========== Bind ========== */

  wrapper.addEventListener("mousedown", e => onStart(e.clientX));
  window.addEventListener("mousemove", e => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);

  wrapper.addEventListener("touchstart", e => onStart(e.touches[0].clientX));
  window.addEventListener("touchmove", e => onMove(e.touches[0].clientX));
  window.addEventListener("touchend", onEnd);

  update(); // position だけ合わせる（opacity触らない）

  return {
    goTo,
    normalize,
    getCurrentPage: () => currentPage
  };
}

