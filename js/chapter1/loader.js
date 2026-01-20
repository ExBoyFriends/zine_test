export function initLoader(pages, loader, dotsContainer){
  window.addEventListener('load', ()=>{
    const firstPage = pages[0];

    // 初期設定：opacity 0 + transition 7.28s
    firstPage.classList.add('first-load','active');

    loader.style.display = 'block';
    loader.style.opacity = '1';
    loader.style.animationPlayState = 'running';

    // loader を 2 秒後にフェードアウト
    setTimeout(()=>{
      // loader フェードアウト
      loader.style.transition = 'opacity 0.5s ease';
      loader.style.opacity = '0';

      // loader を完全に非表示に
      setTimeout(()=> loader.style.display='none', 500);

      // ドット表示
      dotsContainer.classList.add('visible');

      // Safari / iOS 対策：次の描画フレームで first-load を削除
      requestAnimationFrame(()=>{
        firstPage.classList.remove('first-load'); // 初回 7.28 秒フェード開始
      });

    }, 2000); // loader 表示時間を調整したい場合はこの数値を変更
  });
}