//oader.js

export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  let pulseTimer = null;
  let swallowTimer2 = null;
  let hideTimer = null;

  const shadow = document.getElementById("loader-shadow");

  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(swallowTimer2);
    clearTimeout(hideTimer);
  };

  const safeComplete = () => {
    if (completed) return;
    completed = true;
    onComplete?.();
  };

  const finish = () => {
    loader.classList.add("swallow-darkness");
    safeComplete();

    swallowTimer2 = setTimeout(() => {
      loader.classList.add("reveal-start");

      loader.style.transition = "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
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
  };

  const start = () => {
    if (!document.body.contains(loader)) return;
    resetState();
    pulseTimer = setTimeout(finish, 4200);
  };

  // 初回ロード
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // bfcache復帰や戻るボタンでの再表示時
  window.addEventListener("pageshow", (e) => {
    if (!document.body.contains(loader)) return;
    start();
  });

  // ページ離脱時にタイマー停止
  window.addEventListener("pagehide", () => {
    clearAllTimers();
  });
}

