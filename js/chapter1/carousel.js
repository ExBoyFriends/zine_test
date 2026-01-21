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

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === 0 || i === dots.length - 1) return;
      dot.classList.toggle('active', i === currentPage + 1);
    });

    dots[0].style.opacity = currentPage === 0 ? 0 : 1;
  }

  // 👇 ★これを追加するだけ
  updateDots();

  return {
    getCurrentPage: () => currentPage
  };
}

