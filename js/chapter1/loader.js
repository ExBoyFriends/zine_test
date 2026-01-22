export function initLoader(pages, loader, dots) {
  window.addEventListener('load', () => {
    pages[0].classList.add('active');
    dots[1].classList.add('active');

    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.6s ease';
      setTimeout(() => loader.remove(), 600);
    }, 1200);
  }, { once: true });
}
