export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  let pulseTimer = null;
  let swallowTimer2 = null;
  let hideTimer = null;

  // HTMLに合わせて取得
  const shadow = document.getElementById("loader-shadow");

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
      
      // 親ローダーを消す
      loader.style.transition = "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
      loader.style.opacity = "0";

      // ★ 影(shadow)も道連れに消す
      if (shadow) {
        shadow.style.transition = "opacity 2.8s ease-in-out";
        shadow.style.opacity = "0";
      }

      hideTimer = setTimeout(() => {
        loader.style.display = "none";
        // ★ 物理的に消去して、二度と画面を邪魔させない
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
    // すでに消えている(remove済み)なら何もしない
    if (!document.body.contains(loader)) return;
    resetState();
    pulseTimer = setTimeout(finish, 1000); 
  };

  // 実行トリガー：DOMContentLoadedでも動くようにし、loadイベントの遅延を回避
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
    // もしloadが来なくても、3秒経ったら強制スタートさせる（保険）
    setTimeout(() => { if(!completed && !pulseTimer) start(); }, 3000);
  }

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });
}
