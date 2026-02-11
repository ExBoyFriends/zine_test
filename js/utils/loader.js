/**
 * loader.js (完全版)
 * 4.2s鼓動 → 1.0s暗転 → 2.8s夜明けフェード
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
    
    // 暗転フェーズ開始
    loader.classList.add("swallow-darkness");
    safeComplete();

    darkTimer = setTimeout(() => {
      // 夜明けフェード開始
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

    // 4.2秒の鼓動演出
    pulseTimer = setTimeout(finish, 4200); 
  };

  // --- 実行トリガー ---
  // HTMLの解析が終わっているか確認してから実行
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  // 強制終了タイマー（最後の砦）
  setTimeout(() => {
    if (!completed) finish();
  }, 6000);

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });

  window.addEventListener("pagehide", clearAllTimers);
}
