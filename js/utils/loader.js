/*  loader.js */
/**
 * loader.js
 * 役割：5.4秒間の光の鼓動演出と、本編へのスムーズな橋渡し
 */
export function initLoader(loader, onComplete) {
  let finished = false;

  // 1. 必要な要素の取得（黒い幕：fadeLayer）
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

    // ローダー本体を非表示にする
    if (loader) {
      loader.style.display = "none";
    }

    // 本編（main.js側）の処理を実行
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  /**
   * ローディング終了時の演出
   * 光をゆっくり消し、静寂を作ってから本編へ
   */
  const finish = () => {
    if (finished) return;

    // A. Loadingロゴ/画像を1.2秒かけて消す（余韻）
    if (loader) {
      loader.style.transition = "opacity 1.2s ease";
      loader.style.opacity = "0";
    }

    // B. 光の波（fadeLayer）を止め、静かに闇（透明）へ戻す
    if (fadeLayer) {
      // CSSアニメーション（鼓動）を停止
      fadeLayer.style.animation = "none";
      // 1.5秒かけてゆっくりと光を消し去る
      fadeLayer.style.transition = "opacity 1.5s ease";
      fadeLayer.style.opacity = "0";
    }

    // 全てのフェードアウトが終わる頃（約1秒後）に本編へスイッチ
    setTimeout(safeComplete, 1000);
  };

  /**
   * ローディング開始
   */
  const start = () => {
    if (finished) return;

    // ローダーを表示
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // 幕を表示（CSSの lightWave アニメーションが動き出す）
    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
    }

    // 5.4秒間、光の鼓動を堪能させてから終了へ
    setTimeout(finish, 5400);
  };

  // 実行タイミングの制御
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // ブラウザの「戻る」ボタン対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      safeComplete();
    }
  });
}
