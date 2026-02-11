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
  let fadeTimer = null;
  let hideTimer = null;

  const shadow = document.getElementById("loader-shadow");

  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(darkTimer);
    clearTimeout(fadeTimer);
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

      // 完全非表示
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

    // 強制リフローで CSS transition を確実に適用
    void loader.offsetWidth;
  };

  const start = () => {
    // すでに remove されている場合は無視
    if (!document.body.contains(loader)) return;

    resetState();

    // 鼓動フェーズ（初期 8.4秒） → その後 finish
    pulseTimer = setTimeout(finish, 8400);
  };

  // 初回ロード
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });

    // もしloadが遅延した場合の保険（3秒で強制起動）
    setTimeout(() => {
      if (!completed && !pulseTimer) start();
    }, 3000);
  }

  // bfcacheや戻るボタン対応
  window.addEventListener("pageshow", (e) => {
    if (!document.body.contains(loader)) return;
    start();
  });

  // ページ離脱時にタイマーを完全停止
  window.addEventListener("pagehide", () => {
    clearAllTimers();
  });
}
