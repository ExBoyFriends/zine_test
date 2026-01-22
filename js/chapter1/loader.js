export function initLoader(pages, loader, dots) {
  const start = () => {

    // ローディング中は操作不可
    document.body.style.pointerEvents = 'none';

    setTimeout(() => {
      loader.style.transition = 'opacity 0.5s ease';
      loader.style.opacity = '0';

      setTimeout(() => {
        loader.style.display = 'none';

        // 操作解禁
        document.body.style.pointerEvents = 'auto';

        // dots 表示
        document.querySelector('.dots')?.classList.add('visible');
      }, 500);

    }, 1200);
  };

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start, { once: true });
  }
}
