/**
 * loader.js
 * 8.4s鼓動 → 1.0s暗転 → 2.8s引き波フェード
 * 初回・通常遷移・戻る すべて安定動作版（最終安定）
 */

export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  let pulseTimer = null;
  let swallowTimer2 = null;
  let hideTimer = null;

  const fadeLayer = document.getElementById("fadeLayer");

  /* ================================
     タイマー全解除
  ================================= */
  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(swallowTimer2);
    clearTimeout(hideTimer);
  };

  /* ================================
     本編開始（1回だけ）
  ================================= */
  const safeComplete = () => {
    if (completed) return;
    completed = true;
    onComplete?.();
  };

  /* ================================
     ローダー終了処理
  ================================= */
  const finish = () => {
    loader.classList.add("swallow-darkness");

    // ★ ここで即本編開始（依存排除）
    safeComplete();

    // 1秒後：引き波フェード開始
    swallowTimer2 = setTimeout(() => {
      loader.classList.add("reveal-start");

      loader.style.transition =
        "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
      loader.style.opacity = "0";

      if (fadeLayer) {
        setTimeout(() => {
          fadeLayer.style.visibility = "hidden";
        }, 100);
      }

      hideTimer = setTimeout(() => {
        loader.style.display = "none";
      }, 2800);
    }, 1000);
  };

  /* ================================
     状態リセット（bfcache完全対応）
  ================================= */
  const resetState = () => {
    clearAllTimers();
    completed = false;

    loader.classList.remove("swallow-darkness", "reveal-start");
    loader.style.transition = "none";
    loader.style.opacity = "1";
    loader.style.display = "flex";

    if (fadeLayer) {
      fadeLayer.style.visibility = "visible";
      fadeLayer.style.display = "block";
    }

    void loader.offsetWidth; // 強制リフロー
  };

  /* ================================
     ローダー開始
  ================================= */
  const start = () => {
    resetState();
    pulseTimer = setTimeout(finish, 8400);
  };

  /* ================================
     初回ロード
  ================================= */
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  /* ================================
     bfcache復帰時のみ再生
  ================================= */
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      start();
    }
  });

  /* ================================
     ページ離脱時に停止
  ================================= */
  window.addEventListener("pagehide", () => {
    clearAllTimers();
  });
}
