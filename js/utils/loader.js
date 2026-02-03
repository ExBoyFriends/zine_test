// loader.js

// loader.js（完全安定版）

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  const fadeLayer = document.getElementById("fadeLayer");
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;

    loader.style.animation = "none";
    loader.style.opacity = "0";
    loader.style.display = "none";

    fadeLayer?.classList.add("hide");

    onComplete?.();
  };

  const start = () => {
    // 初期状態
    loader.style.display = "block";
    loader.style.opacity = "1";
    loader.style.animation = "siren 2s linear infinite";

    fadeLayer?.classList.remove("hide");

    // ⏱ 演出時間で必ず終了（絶対止まらない）
    setTimeout(finish, 4200);
  };

  // 初回ロード
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // bfcache 復帰（即スキップ）
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    loader.style.display = "none";
    loader.style.opacity = "0";
    loader.style.animation = "none";

    fadeLayer?.classList.add("hide");

    onComplete?.();
  });
}


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

