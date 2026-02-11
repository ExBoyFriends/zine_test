/**
 * loader.js
 * 修正版：内部スコープを整理し、確実に実行されるように修正
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  let pulseTimer = null;
  let darkTimer = null;
  let hideTimer = null;

  const shadow = document.getElementById("loader-shadow");

  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(darkTimer);
    clearTimeout(hideTimer);
  };

  const safeComplete = () => {
    if (completed) return;
    completed = true;
    onComplete?.();
  };

  const finish = () => {
    if (completed) return;
    loader.classList.add("swallow-darkness");
    safeComplete();

    darkTimer = setTimeout(() => {
      loader.classList.add("reveal-start");
      loader.style.transition = "opacity 2.8s cubic-bezier(0.2,1,0.2,1)";
      loader.style.opacity = "0";

      if (shadow) {
        shadow.style.transition = "opacity 2.8s ease-in-out";
        shadow.style.opacity = "0";
      }

      hideTimer = setTimeout(() => {
        loader.style.display = "none";
        loader.remove(); 
      }, 2800);
    }, 1000);
  };

  const start = () => {
    // 二重起動防止
    if (!document.body.contains(loader) || completed) return;
    
    clearAllTimers();
    loader.classList.remove("swallow-darkness", "reveal-start");
    loader.style.opacity = "1";
    loader.style.display = "flex";

    if (shadow) {
      shadow.style.display = "block";
      shadow.style.opacity = "1";
    }
    void loader.offsetWidth;

    // 4.2秒後に終了処理へ
    pulseTimer = setTimeout(finish, 4200); 
  };

  // --- initLoader関数の中で実行命令を出す ---
  
  // 1. 即時実行（HTML解析後）
  setTimeout(start, 0);

  // 2. 万が一の保険：どんなことがあっても8秒後には幕を開ける
  setTimeout(() => {
    if (!completed) {
      console.log("保険のタイマーで作動");
      finish();
    }
  }, 8000);

  // bfcache/ページ遷移対応
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });

  window.addEventListener("pagehide", clearAllTimers);
}
