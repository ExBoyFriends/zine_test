// loader.js

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  const fadeLayer = document.getElementById("fadeLayer");

  let finished = false;
  let started  = false;

  /* =====================
     見た目リセット（初回専用）
  ===================== */
  const resetVisualState = () => {
    finished = false;
    started  = false;

    loader.style.display   = "block";
    loader.style.opacity   = "1";
    loader.style.filter    = "";
    loader.style.animation = "siren 2s linear infinite";

    fadeLayer?.classList.remove("hide");
  };

  /* =====================
     完了処理
  ===================== */
  const finish = () => {
    if (finished) return;
    finished = true;

    /* ローダーを「明」で止める */
    loader.style.animation = "none";
    loader.style.filter   = "brightness(1)";
    loader.style.opacity  = "0";

    requestAnimationFrame(() => {
      loader.style.display = "none";

      /* 黒フェード解除 */
      fadeLayer?.classList.add("hide");

      /* 闇がわずかに残る瞬間に次へ */
      setTimeout(() => {
        onComplete?.();
      }, 60);
    });
  };

  /* =====================
     開始処理（初回）
  ===================== */
  const start = () => {
    if (started) return;
    started = true;

    resetVisualState();

    /* 演出時間 */
    setTimeout(() => {
      loader.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 1200); // 念のため保険
    }, 4000);
  };

  /* ===== 初回ロード ===== */
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  /* =====================
     bfcache 復帰対応（★重要）
  ===================== */
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    /* 🔑 演出は一切しない。即、世界を見せる */
    finished = true;
    started  = true;

    loader.style.display   = "none";
    loader.style.opacity   = "0";
    loader.style.animation = "none";

    fadeLayer?.classList.add("hide");

    onComplete?.();
  });
}

