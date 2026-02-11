/**
 * loader.js
 * 8.4s鼓動 → 1.0s暗転 → 2.8s引き波フェード
 * 初回・通常遷移・戻る・再遷移すべて同じ動作
 */
export function initLoader(loader, onComplete) {
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
     本編開始トリガー
  ================================= */
  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  /* ================================
     ローダー終了処理
  ================================= */
  const finish = () => {
    if (finished) return;

    loader?.classList.add("swallow-darkness");

    // 暗転直後に本編準備開始
    swallowTimer1 = setTimeout(safeComplete, 200);

    // 真っ暗になった瞬間
    swallowTimer2 = setTimeout(() => {
      if (!loader) return;

      loader.classList.add("reveal-start");

      loader.style.transition =
        "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
      loader.style.opacity = "0";

      // 影の計算を停止
      if (fadeLayer) {
        setTimeout(() => {
          fadeLayer.style.visibility = "hidden";
        }, 100);
      }

      // 完全消滅
      hideTimer = setTimeout(() => {
        loader.style.display = "none";
      }, 2800);
    }, 1000);
  };

  /* ================================
     状態リセット（超重要）
  ================================= */
  const resetState = () => {
    clearAllTimers();
    finished = false;

    if (loader) {
      loader.classList.remove("swallow-darkness", "reveal-start");
      loader.style.transition = "none";
      loader.style.opacity = "1";
      loader.style.display = "flex";
    }

    if (fadeLayer) {
      fadeLayer.style.visibility = "visible";
      fadeLayer.style.display = "block";
    }

    // ★ 強制リフロー（bfcache対策の核）
    void loader?.offsetWidth;
  };

  /* ================================
     ローダー開始
  ================================= */
  const start = () => {
    resetState();
    pulseTimer = setTimeout(finish, 8400);
  };

  /* ================================
     ★ 核心：pageshowで必ず開始
     （初回・戻る・再遷移すべてここ）
  ================================= */
  window.addEventListener("pageshow", () => {
    start();
  });

  /* ================================
     離脱時にタイマー完全停止
  ================================= */
  window.addEventListener("pagehide", () => {
    clearAllTimers();
  });
}
