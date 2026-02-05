// フェードアウトして次の処理へ
// onFinish: フェードアウト完了後に実行する関数
// duration: フェードアウトにかかる時間（ms）
export function fadeOutAndGo(onFinish, duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

  // フェードアウト開始
  fade.classList.remove("show");

  setTimeout(() => {
    onFinish?.();
  }, duration);
}

// 冒頭フェードイン
export function fadeInStart(duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  // 最初は非表示 → 表示
  fade.classList.add("show");

  setTimeout(() => {
    // フェードイン完了後に非表示に
    fade.classList.remove("show");
  }, duration);
}
