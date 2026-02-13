/**
 * loader.js (配置完了待ち・完全版)
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

// loader.js 内の finish 関数を書き換え

// loader.js 内の finish 関数を以下に差し替え

const finish = () => {
  if (completed) return;
  completed = true;

  // 1. 暗転
  loader.classList.add("swallow-darkness");

  // 2. 1.2秒後、暗闇の中で処理
  setTimeout(() => {
    
   // ★追加：計算を開始する前に、display: none を解除して「実体」を作る
    const chapter = document.querySelector(".chapter");
    if (chapter) chapter.classList.add("active");
    
    setTimeout(() => {
       if (onComplete) onComplete();
    }, 0);

    // 3. ブラウザに「準備して！」と伝えてから幕を開ける
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 配置完了を待つ「静寂」の時間
        setTimeout(() => {
          // これで確実に reveal-start を実行させる
          loader.classList.add("reveal-start");
          loader.style.opacity = "0";
          if (shadow) shadow.style.opacity = "0";

          setTimeout(() => {
            loader.remove();
          }, 3000);
        }, 1000); // ここを 1000 にして余裕を持たせる
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
