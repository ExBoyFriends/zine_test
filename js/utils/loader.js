/*  loader.js */


export function initLoader(loader, onComplete) {
  let finished = false;
  let blinkTimeout = null;

  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  const safeComplete = () => {
    if (finished) return;
    finished = true;

    // loader を完全非表示
    if (loader) loader.style.display = "none";
    cancelAnimationFrame(blinkTimeout);

    // fadeLayer を非表示に
    if (fadeLayer) {
      fadeLayer.classList.add("hide");
      fadeLayer.style.pointerEvents = "none";
      fadeLayer.style.opacity = "1"; // 次回フェード用にリセット
    }

    onComplete?.();
  };

  // ローディング画像点滅ループ
  const blink = () => {
    if (finished) return;
    if (!loader) return;

    const img = loader.querySelector("img");
    if (!img) return;

    img.style.opacity = img.style.opacity === "1" ? "0.2" : "1";
    blinkTimeout = setTimeout(() => requestAnimationFrame(blink), 150);
  };

  // ローディング終了
  const finish = () => {
    if (finished) return;

    // fadeLayer フェードアウト
    if (fadeLayer) {
      fadeLayer.classList.add("hide");
      fadeLayer.style.pointerEvents = "none";
    }

    safeComplete();
  };

  // ローディング開始
  const start = () => {
    if (finished) return;

    // loader 表示
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // fadeLayer 表示
    if (fadeLayer) fadeLayer.classList.remove("hide");

    blink(); // 画像点滅開始

    // ローディング表示時間（例: 2.5秒）後に finish
    setTimeout(finish, 2500);
  };

  // ページロード完了時
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // bfcache 復帰時
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    if (loader) {
      loader.style.display = "none";
      loader.style.opacity = "0";
    }

    if (fadeLayer) fadeLayer.classList.add("hide");
    safeComplete();
  });
}

