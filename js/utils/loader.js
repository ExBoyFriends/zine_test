/*  loader.js */

export function initLoader(loader, onComplete) {
  let finished = false;

  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  const safeComplete = () => {
    if (finished) return;
    finished = true;

    if (loader) loader.style.display = "none";
    onComplete?.();
  };

  const finish = () => {
    if (finished) return;

    // 1. ローディング画像を 0.8秒かけて透明にする
    if (loader) {
      loader.style.transition = "opacity 0.8s ease";
      loader.style.opacity = "0";
    }

    // 2. 黒い幕(fadeLayer)の呼吸アニメーションを止めて「真っ黒(1)」で固定
    if (fadeLayer) {
      fadeLayer.style.animation = "none";
    }

    // 3. 画像が消え始めた 0.4秒後に、本編開始(onComplete)を呼ぶ
    // これにより黒い幕が残った状態で、裏で本編の準備が始まる
    setTimeout(safeComplete, 400); 
  };

  const start = () => {
    if (finished) return;

    if (loader) {
      loader.style.display = "flex";
    }

    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
      // opacity は CSS の animation（呼吸）に任せるためここでは指定しない
    }

    // 5.4秒後に終了シーケンス開始
    setTimeout(finish, 5400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;
    if (loader) loader.style.display = "none";
    if (fadeLayer) {
      fadeLayer.style.animation = "none";
      fadeLayer.classList.add("hide");
    }
    safeComplete();
  });
}
