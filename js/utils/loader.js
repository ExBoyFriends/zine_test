/**
 * loader.js
 * 役割：忍び寄る闇の演出。最後は画面を完全に飲み込み、本編へ繋ぐ。
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  /**
   * 本編開始処理
   */
  const safeComplete = () => {
    if (finished) return;
    finished = true;
    
    if (loader) {
      loader.style.display = "none";
    }
    
    // main.js側のコールバックを呼び出し
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  /**
   * ローディング終了演出
   */
  const finish = () => {
    if (finished) return;

    // 1. 闇を巨大化させ、画面を真っ黒にする
    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // 2. 画面が完全に黒く染まったタイミング（1.2秒後）
    setTimeout(() => {
      // 3. 【重要】左上の違和感を消すため、影レイヤーを即座に非表示
      if (fadeLayer) {
        fadeLayer.style.display = "none";
      }

      if (loader) {
        // ローダー全体（真っ黒な幕）をフワッと消す
        loader.style.transition = "opacity 0.8s ease-out";
        loader.style.opacity = "0";
      }

      // 4. ローダーが消えきる直前に、背後で本編（背景アニメ）を開始
      setTimeout(safeComplete, 400);
    }, 1200);
  };

  /**
   * 演出開始
   */
  const start = () => {
    if (finished) return;

    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // 8.4秒間の明滅後、終了演出へ
    setTimeout(finish, 8400);
  };

  // 実行タイミングの制御
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // 戻るボタン対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) safeComplete();
  });
}
