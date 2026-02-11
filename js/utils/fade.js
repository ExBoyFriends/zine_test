/**
 * fade.js (CSS同期・完全版)
 */
export function fadeInStart(duration = 3400) {
  // 共通CSSの設計に基づき、loader自体をフェードアウトさせる
  const loader = document.getElementById("loader");
  if (!loader) return;

  // すでに暗転処理が始まっている場合は二重実行しない
  if (loader.classList.contains("swallow-darkness")) return;

  loader.style.transition = `opacity ${duration}ms cubic-bezier(.16,1,.3,1)`;
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
  }, duration);
}

export function fadeOutAndGo(callback, duration = 1000) {
  // 移動時は画面全体を暗くする必要があるため、
  // bodyに一時的な黒い幕を作るか、既存のloaderを再利用します
  let overlay = document.getElementById("loader");
  
  if (!overlay) {
    // loaderが既に削除されている場合は、簡易的な幕を生成
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "#000";
    overlay.style.zIndex = "20000";
    overlay.style.opacity = "0";
    overlay.style.transition = `opacity ${duration}ms ease-in-out`;
    document.body.appendChild(overlay);
  } else {
    // 既存のloaderがある場合はリセットして表示
    overlay.style.display = "flex";
    overlay.style.opacity = "0";
    overlay.classList.remove("reveal-start");
  }

  // 強制的に再描画させてから暗転
  void overlay.offsetWidth;
  overlay.style.opacity = "1";

  setTimeout(() => {
    callback?.();
  }, duration);
}
