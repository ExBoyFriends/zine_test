/**
 * loader.js
 * 8.4s鼓動 → 1.0s暗転 → 2.8s引き波フェード
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  let pulseTimer = null;
  let swallowTimer1 = null;
  let swallowTimer2 = null;
  let hideTimer = null;

  const fadeLayer = document.getElementById("fadeLayer");

  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(swallowTimer1);
    clearTimeout(swallowTimer2);
    clearTimeout(hideTimer);
  };

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (typeof onComplete === "function") onComplete();
  };

  const finish = () => {
    if (finished) return;

    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    swallowTimer1 = setTimeout(safeComplete, 200);

    swallowTimer2 = setTimeout(() => {
      if (!loader) return;

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

    // ★ 強制リフロー（これが超重要）
    void loader?.offsetWidth;
  };

  const start = () => {
    resetState();
    pulseTimer = setTimeout(finish, 8400);
  };

  // 初回ロード
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // 戻る（bfcache）対応
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      start(); // 同じ8.4秒フル再生
    }
  });

  // ページ離脱時にタイマー全解除
  window.addEventListener("pagehide", () => {
    clearAllTimers();
  });
}
