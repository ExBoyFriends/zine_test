/**
 * loader.js
 * 安定版：8.4s鼓動 → 1.0s暗転 → 2.8s夜明けフェード → 本編開始
 * 初回ロード・戻る・bfcache復帰に対応
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

    // 暗転フェーズ
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

  const resetState = () => {
    clearAllTimers();
    completed = false;
    loader.classList.remove("swallow-darkness", "reveal-start");
    loader.style.opacity = "1";
    loader.style.display = "flex";

    if (shadow) {
      shadow.style.display = "block";
      shadow.style.opacity = "1";
    }
    void loader.offsetWidth;
  };

  const start = () => {
    if (!document.body.contains(loader) || pulseTimer) return; // 二重実行防止
    resetState();
    
    // ★ ここを短縮：鼓動演出を 1秒（1000）程度にする
    pulseTimer = setTimeout(finish, 1000); 
  };

  // --- 実行ロジックの改善 ---
  // loadイベントを待たずに、このスクリプトが読み込まれたら即座にカウントダウンを開始する
  start();

  // 保険：もし何らかの理由で止まった場合、5秒後に強制終了
  setTimeout(() => {
    if (!completed) finish();
  }, 5000);

  window.addEventListener("pageshow", (e) => {
    if (document.body.contains(loader)) start();
  });

  window.addEventListener("pagehide", clearAllTimers);
}
