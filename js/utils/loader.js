/**
 * loader.js
 * 8.4s鼓動 → 1.0s暗転 → 2.8s引き波フェード
 * 初回・通常遷移・戻る すべて安定動作版
 */

export function initLoader(loader, onComplete) {
  if (!loader) return;

  let finished = false;
  let pulseTimer = null;
  let swallowTimer1 = null;
  let swallowTimer2 = null;
  let hideTimer = null;

  const fadeLayer = document.getElementById("fadeLayer");

  /* ================================
     タイマー全解除
  ================================= */
  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(swallowTimer1);
    clearTimeout(swallowTimer2);
    clearTimeout(hideTimer);
  };

  /* ================================
     本編開始（1回だけ）
  ================================= */
  const safeComplete = () => {
    if (finished) return;
    finished = true;
    onComplete?.();
  };

  /* ================================
     ローダー終了処理
  ================================= */
  const finish = () => {
    if (finished) return;

    loader.classList.add("swallow-darkness");

    // 暗転直後に本編準備開始
    swallowTimer1 = setTimeout(() => {
      safeComplete();
    }, 200);

    // 1秒後：引き波フェード開始
    swallowTimer2 = setTimeout(() => {
      loader.classList.add("reveal-start");

      loader.style.transition =
        "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
      loader.style.opacity = "0";

      // fadeLayer があれば視覚演出終了
      if (fadeLayer) {
        setTimeout(() => {
          fadeLayer.style.visibility = "hidden";
        }, 100);
      }

      // 完全非表示
      hideTimer = setTimeout(() => {
        loader.style.display = "none";
      }, 2800);
    }, 1000);
  };

  /* ================================
     状態リセット（bfcache対策の核）
  ================================= */
  const resetState = () => {
    clearAllTimers();
    finished = false;

    loader.classList.remove("swallow-darkness", "reveal-start");
    loader.style.transition = "none";
    loader.style.opacity = "1";
    loader.style.display = "flex";

    if (fadeLayer) {
      fadeLayer.style.visibility = "visible";
      fadeLayer.style.display = "block";
    }

    // ★ 強制リフロー（超重要）
    void loader.offsetWidth;
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
     ページ離脱時にタイマー停止
  ================================= */
  window.addEventListener("pagehide", () => {
    clearAllTimers();
  });
}
