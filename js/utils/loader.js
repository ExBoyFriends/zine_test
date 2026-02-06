/**
 * loader.js
 * 役割：左上からのスポットライト演出。
 * 画像は静止させ、光の鼓動のみをループ。最後は闇ごと本編へリレーする。
 */
export function initLoader(loader, onComplete) {
  let finished = false;

  // 光の層（fadeLayer）の取得
  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  /**
   * 本編を開始する最終処理
   */
  const safeComplete = () => {
    if (finished) return;
    finished = true;

    // ローダー全体を完全に非表示にする
    if (loader) {
      loader.style.display = "none";
    }

    // 本編開始のコールバック（fadeInStartなど）を実行
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  /**
   * ローディング終了演出
   * 8.4秒後、スポットライトを止めて、画像と闇をじわっと消す
   */
  const finish = () => {
    if (finished) return;

    // 1. 画像と黒背景(loader)を1.8秒かけて本編へ溶け込ませる
    if (loader) {
      loader.style.transition = "opacity 1.8s ease";
      loader.style.opacity = "0";
    }

    // 2. スポットライト（fadeLayer）の動きを止め、同時に消し去る
    if (fadeLayer) {
      fadeLayer.style.animation = "none";
      fadeLayer.style.transition = "opacity 1.8s ease";
      fadeLayer.style.opacity = "0";
    }

    // 余韻が消えきる前に、本編の表示を開始させる（1.2秒後）
    setTimeout(safeComplete, 1200); 
  };

  /**
   * 演出開始
   */
  const start = () => {
    if (finished) return;

    // 黒背景のローダーを表示
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // スポットライトを開始
    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
    }

    // 8.4秒間、光の演出を見せる
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // ブラウザ戻る対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      safeComplete();
    }
  });
}
