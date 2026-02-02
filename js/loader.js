/* loader.js */

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;

    loader.style.display = "none";
    onComplete?.(); // ← ここでだけ呼ぶ
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    // ローディング表示時間（例：4秒）
    setTimeout(() => {
      // フェードアウト開始
      loader.style.opacity = "0";

      // フェードアウト完了を待つ
      loader.addEventListener("transitionend", finish, { once: true });

      // 保険（transitionend が来なかった場合）
      setTimeout(finish, 8000);
    }, 4000);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
