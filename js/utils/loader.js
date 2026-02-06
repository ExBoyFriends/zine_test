export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (loader) loader.style.display = "none";
    if (typeof onComplete === "function") onComplete();
  };

  const finish = () => {
    if (finished) return;

    // 1. 闇を広げる（transitionの時間を短く、またはなしにすると安定します）
    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // 2. 闇が満ちるのを待つ時間を少し短縮（カクつきを感じる前に次へ）
    setTimeout(() => {
      if (loader) {
        // 3. transitionを非常に滑らかなものに固定
        loader.style.transition = "opacity 0.6s ease-out";
        loader.style.opacity = "0";
      }

      // 4. ローダーが完全に消える「前」に本編を準備完了にする
      // これにより、本編背景が既に描画された状態でローダーが消えていきます
      setTimeout(safeComplete, 200); 
    }, 1000); // 1.2sから少し短縮
  };

  const start = () => {
    if (finished) return;
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

  // 戻るボタン対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) safeComplete();
  });
}
