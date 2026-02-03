// loader.js（完全安定版）
export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  const fadeLayer = document.getElementById("fadeLayer");
  let isLoadingComplete = false;

  // 完了処理
  const finish = () => {
    if (isLoadingComplete) return;
    isLoadingComplete = true;

    // ローダーのアニメーション停止と非表示化
    loader.style.animation = "none";
    loader.style.opacity  = "0";
    loader.style.display  = "none";

    // フェードレイヤーの非表示化
    fadeLayer?.classList.add("hide");

    // 次の処理を少し遅れて実行
    setTimeout(() => {
      onComplete?.();
    }, 60);
  };

  // 開始処理（初回）
  const start = () => {
    // すでに開始されている場合は何もしない
    if (isLoadingComplete) return;

    // 初期化
    loader.style.display = "block";
    loader.style.opacity = "1";
    loader.style.animation = "siren 2s linear infinite";

    fadeLayer?.classList.remove("hide");

    // 演出時間後に完了処理を実行
    setTimeout(finish, 4200);  // 演出時間の後に必ず完了処理を行う
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
