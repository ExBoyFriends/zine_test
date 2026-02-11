//loader.js
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  let pulseTimer = null;
  let swallowTimer2 = null;
  let hideTimer = null;

  const fadeLayer = document.getElementById("loader-shadow");

  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(swallowTimer2);
    clearTimeout(hideTimer);
  };

  const safeComplete = () => {
    if (completed) return;
    completed = true;
    if (onComplete) onComplete();
  };

  const finish = () => {
    loader.classList.add("swallow-darkness");
    safeComplete();

    swallowTimer2 = setTimeout(() => {
      loader.classList.add("reveal-start");
      loader.style.transition = "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
      loader.style.opacity = "0";

      if (fadeLayer) {
        // visibility だけでなく opacity も制御して確実に消す
        fadeLayer.style.opacity = "0";
        setTimeout(() => {
          fadeLayer.style.visibility = "hidden";
          fadeLayer.style.display = "none";
        }, 100);
      }

      hideTimer = setTimeout(() => {
        loader.style.display = "none";
      }, 2800);
    }, 1000);
  };

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
      fadeLayer.style.opacity = "1"; // 明示的に戻す
    }
    void loader.offsetWidth; 
  };

  const start = () => {
    resetState();
    // 確実にタイマーをセット
    pulseTimer = setTimeout(finish, 1000); 
  };

  // --- 実行トリガー ---
  if (document.readyState === "complete") {
    start();
  } else {
    // どちらか早い方で実行
    window.addEventListener("load", start, { once: true });
    // もしloadが遅すぎる場合のための予備（DOMContentLoaded）
    document.addEventListener("DOMContentLoaded", () => {
       if (!pulseTimer) start();
    }, { once: true });
  }

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });
}
