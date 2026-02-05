/**
 * loader.js
 * 役割：8.4秒間の琥珀色の鼓動演出。
 * 画像が闇に溶け、光が奥へ引いていく演出を管理し、本編へスムーズにリレーする。
 */
export function initLoader(loader, onComplete) {
  let finished = false;

  // 黒い幕（光の層）の取得
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

    // ローダー要素を完全に消去
    if (loader) {
      loader.style.display = "none";
    }

    // main.js側の本編開始処理（fadeInStartなど）を呼び出す
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  /**
   * ローディング終了演出
   * 8.4秒経過後、画像と光を同時に闇へと溶け込ませる
   */
  const finish = () => {
    if (finished) return;

    // 1. 背景色（黒）を含めたローダー全体を1.8秒かけてフェードアウト
    // これにより、画像が闇に溶け込んだ状態で静かに本編へ切り替わる
    if (loader) {
      loader.style.transition = "opacity 1.8s ease";
      loader.style.opacity = "0";
    }

    // 2. 光の層（fadeLayer）の動きを止め、同時に消し去る
    if (fadeLayer) {
      // CSSアニメーション（鼓動）を停止して干渉を防ぐ
      fadeLayer.style.animation = "none";
      fadeLayer.style.transition = "opacity 1.8s ease";
      fadeLayer.style.opacity = "0";
    }

    // フェードアウトの余韻（1.8秒）の途中で本編の準備を開始（1.2秒後）
    setTimeout(safeComplete, 1200); 
  };

  /**
   * 演出開始
   */
  const start = () => {
    if (finished) return;

    // ローダーを表示（CSS側の背景黒設定と連動）
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // 光の層を表示（CSS側の sirenWave アニメーション開始）
    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
    }

    // 指定した時間（8.4秒）だけ演出をループさせる
    setTimeout(finish, 8400);
  };

  // ページの読み込み状況に応じて実行
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // ブラウザの「戻る」ボタンで戻った際の表示不具合（bfcache）対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      safeComplete();
    }
  });
}
