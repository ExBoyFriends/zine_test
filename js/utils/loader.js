/**
 * loader.js (配置完了待ち・完全版)
 */

export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

  const finish = () => {
    if (completed) return;
    completed = true;

    // 1. まず暗転演出を開始
    loader.classList.add("swallow-darkness");

    setTimeout(() => {
      const chapter = document.querySelector(".chapter");
      if (chapter) {
        console.log("Loader: Activating chapter...");
        chapter.classList.add("active");
        void chapter.offsetWidth; // リフロー強制
      }

      // ★ 修正ポイント1: 先に幕を開ける命令を出す（アニメーションを予約）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            console.log("Loader: Revealing start...");
            loader.classList.add("reveal-start");
            loader.style.opacity = "0";
            if (shadow) shadow.style.opacity = "0";

            // ★ 修正ポイント2: 幕が開き始めた「後」で初期化を実行する
            // これにより、初期化の重さでアニメーションがカクつくのを防ぎます
            setTimeout(() => {
              console.log("Loader: Executing onComplete...");
              if (onComplete) {
                try {
                  onComplete();
                } catch (e) {
                  console.error("Loader: Error in onComplete:", e);
                }
              }
            }, 100); // 幕が動き出すわずかな隙間を作る

            setTimeout(() => {
              loader.remove();
            }, 3000);
          }, 800); // 1000msから少し短縮してテンポを改善
        });
      });
    }, 1200); 
  };

  const start = () => {
    if (!document.body.contains(loader)) return;
    // ★ 修正ポイント3: ローディングをもっと見せたいならここを増やす
    // 元の 5200 より少し長めに設定（例: 6500 = 6.5秒）
    setTimeout(finish, 6500); 
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
}
