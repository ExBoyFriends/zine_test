export function initLoader(pages, loader, dots) {
  const start = () => {
    pages[0].classList.add('active');

    setTimeout(() => {
      loader.style.transition = 'opacity 0.5s ease';
      loader.style.opacity = '0';

      setTimeout(() => {
        loader.style.display = 'none';
        dots.classList.add('visible');
      }, 500);

    }, 1200);
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

