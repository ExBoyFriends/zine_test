/**
 * loader.js (配置完了待ち・完全版)
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

// loader.js 内の finish 関数を書き換え

const finish = () => {
  if (completed) return;
  completed = true;

  // 1. まず暗転させる
  loader.classList.add("swallow-darkness");

  // 2. 1.2秒後、真っ暗な中で本編の初期化を開始
  setTimeout(() => {
    if (onComplete) onComplete();

    /* ========================================================
       ここからが「重なり」を消すための鉄壁のフローです。
       setTimeout(..., 0) ではなく、2回描画を待つことで
       ブラウザに「3D配置が完了した画面」を内部的に作らせます。
       ======================================================== */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        
        // 3Dの配置が完了した「あと」で、さらに 800ms の静寂を作る
        // これで「暗転から明けるまでの時間」が物理的に伸びます。
        setTimeout(() => {
          // 3. 全てが整ってから夜明け
          loader.classList.add("reveal-start");
          
          loader.style.opacity = "0";
          if (shadow) shadow.style.opacity = "0";

          setTimeout(() => {
            loader.style.display = "none";
            if (loader.parentNode) loader.remove();
          }, 3000);

        }, 800); // ← ここを 1000 や 1500 にすれば、さらに暗闇が伸びます
      });
    });

  }, 1200); 
};
  
  const start = () => {
    if (!document.body.contains(loader)) return;
    setTimeout(finish, 5200); // 鼓動の時間
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}
