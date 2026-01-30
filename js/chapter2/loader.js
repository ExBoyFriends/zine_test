export function initLoader(loader) {
  const start = () => {
    pages[0].classList.add('active');

    setTimeout(() => {
      // 描画フレームに合わせて opacity を変える
      requestAnimationFrame(() => {
        loader.style.opacity = '0';
      });

      // transition 終了を正確に拾う
      loader.addEventListener(
        'transitionend',
        () => {
          loader.style.display = 'none';
          dots.classList.add('visible');
        },
        { once: true }
      );
    }, 1200);
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}　　　　　　　　　
