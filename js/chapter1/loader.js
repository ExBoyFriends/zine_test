export function initLoader(pages, loader, dotsContainer) {

  const start = () => {
    const firstPage = pages[0];

    firstPage.classList.add('first-load', 'active');

    loader.style.display = 'block';
    loader.style.opacity = '1';

    setTimeout(() => {
      loader.style.transition = 'opacity 0.5s ease';
      loader.style.opacity = '0';

      firstPage.classList.remove('first-load');

      // ドットを少し遅らせて表示
      setTimeout(() => {
        dotsContainer.classList.add('visible');
      }, 400);

      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);

    }, 7280);
  };

  // 👇 ここが超重要
  if (document.readyState === 'complete') {
    start(); // すでに load 済み
  } else {
    window.addEventListener('load', start, { once: true });
  }
}
