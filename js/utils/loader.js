/**
 * loader.js (配置完了待ち・完全版)
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

// loader.js 内の finish 関数

const finish = () => {
  if (completed) return;
  completed = true;

  console.log("Loader: Starting finish sequence..."); // デバッグ
  loader.classList.add("swallow-darkness");

  setTimeout(() => {
    const chapter = document.querySelector(".chapter");
    if (chapter) {
      console.log("Loader: Activating chapter...");
      chapter.classList.add("active");
      
      // ★重要：一度ブラウザにレイアウトを計算させる（リフロー強制）
      void chapter.offsetWidth; 
    }

    setTimeout(() => {
      console.log("Loader: Executing onComplete...");
      if (onComplete) {
        try {
          onComplete();
        } catch (e) {
          console.error("Loader: Error in onComplete:", e);
        }
      }
    }, 50); // 0msではなく少し待つと3D計算が安定します

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          console.log("Loader: Revealing start...");
          loader.classList.add("reveal-start");
          loader.style.opacity = "0";
          if (shadow) shadow.style.opacity = "0";

          setTimeout(() => {
            loader.remove();
          }, 3000);
        }, 1000);
      });
    });
  }, 1200); 
};


  const start = () => {
    console.log("Loader: Fast-looming start..."); // これがコンソールに出るか確認
    if (!document.body.contains(loader)) return;
    setTimeout(finish, 5200); 
  };

  // すでにDOMが読み込み済みのケースを確実に拾う
  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
}
