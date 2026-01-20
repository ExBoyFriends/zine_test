export function initLoader(pages, loader, dotsContainer){
  window.addEventListener('load', ()=>{
    const firstPage = pages[0];

    // 初期設定：最初のページは opacity:0 + transition
    firstPage.classList.add('first-load','active');
    loader.style.display = 'block';
    loader.style.opacity = '1';
    loader.style.animationPlayState = 'running';

    // 2秒後に loader をフェードアウト
    setTimeout(()=>{
      // loader フェードアウト
      loader.style.transition = 'opacity 0.5s ease';
      loader.style.opacity = '0';

      // loader を非表示に
      setTimeout(()=> loader.style.display='none', 500);

      // ドット表示
      dotsContainer.classList.add('visible');

      // Safari 等で transition を確実に発火させる
      firstPage.getBoundingClientRect(); // 強制再描画
      firstPage.classList.remove('first-load'); // 7.28 秒の CSS フェード開始
    }, 2000);
  });
}