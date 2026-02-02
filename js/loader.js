// loader.js

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  const fadeLayer = document.getElementById("fadeLayer");
  let finished = false;
  let started = false;

  const resetVisualState = () => {
    finished = false;
    started = false;

    loader.style.display = "block";
    loader.style.opacity = "1";
    loader.style.filter = "";
    loader.style.animation = "";

    fadeLayer?.classList.remove("hide");
  };

  const finish = () => {
    if (finished) return;
    finished = true;

    /* ローディング演出を「明」で止める */
    loader.style.animation = "none";
    loader.style.filter = "brightness(1)";
    loader.style.opacity = "0";

    requestAnimationFrame(() => {
      loader.style.display = "none";

      // 闇フェード解除
      fadeLayer?.classList.add("hide");

      // 闇がわずかに残る瞬間に次へ
      setTimeout(() => {
        onComplete?.();
      }, 60);
    });
  };

  const start = () => {
    if (started) return;
    started = true;

    resetVisualState();

    setTimeout(() => {
      loader.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 1200);
    }, 4000);
  };

  /* ===== 初回ロード ===== */
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  /* ===== bfcache 復帰対応 ===== */
  window.addEventListener("pageshow", e => {
    if (e.persisted) {
      // 🔑 黒画面・残留演出を完全排除
      resetVisualState();

      // 即完了扱いで世界を見せる
      loader.style.display = "none";
      fadeLayer?.classList.add("hide");

      finished = true;
      onComplete?.();
    }
  });
}

document.querySelector('.fade-root')?.classList.add('visible');
document.getElementById('fadeLayer')?.classList.add('hidden');
