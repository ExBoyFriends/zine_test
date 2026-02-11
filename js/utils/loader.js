/**
 * loader.js (CSS同期・完全版)
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

  const finish = () => {
    if (completed) return;
    completed = true;

    // 1. まず暗転させる (CSS: .swallow-darkness)
    loader.classList.add("swallow-darkness");

    // 2. 暗転（1秒）が終わる頃に本編表示の準備を完了させる
    setTimeout(() => {
      if (onComplete) onComplete();

      // 3. 夜明けフェード開始 (CSS: .reveal-start)
      loader.classList.add("reveal-start");
      loader.style.transition = "opacity 2.8s cubic-bezier(0.2,1,0.2,1)";
      loader.style.opacity = "0";

      if (shadow) {
        shadow.style.transition = "opacity 2.8s ease-in-out";
        shadow.style.opacity = "0";
      }

      // 4. 完全に消えたら要素を削除
      setTimeout(() => {
        loader.style.display = "none";
        if (loader.parentNode) loader.remove();
      }, 2800);
    }, 1000);
  };

  const start = () => {
    if (!document.body.contains(loader)) return;
    // 4.2秒の鼓動演出のあと終了へ
    setTimeout(finish, 4200);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}
