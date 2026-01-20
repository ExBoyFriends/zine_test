export function initLoader(pages, loader, dotsContainer) {
  window.addEventListener('load', () => {
    const firstPage = pages[0];

    // 初期設定
    firstPage.classList.add('first-load', 'active');
    loader.style.display = 'block';
    loader.style.opacity = '1';
    loader.style.animationPlayState = 'running';

    // loader フェードアウト開始（2秒後）
    setTimeout(() => {
      loader.style.transition = 'opacity 0.5s ease';
      loader.style.opacity = '0';

      // loader 完全非表示
      setTimeout(() => loader.style.display = 'none', 500);

      // ドット表示
      dotsContainer.classList.add('visible');

      // Safari でもその他ブラウザでも同じタイミングでフェード開始
      requestAnimationFrame(() => {
        firstPage.classList.remove('first-load'); // 7.28秒フェード開始
      });

    }, 4600); // loader 表示時間
  });
}