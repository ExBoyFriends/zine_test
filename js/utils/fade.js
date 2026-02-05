// フェードアウトして次の処理へ
// onFinish: フェードアウト完了後に実行する関数
// duration: フェードアウトにかかる時間（ms）
export function fadeOutAndGo(onFinish, duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  fade.classList.add("show");

 setTimeout(() => {
    fade.style.pointerEvents = "none";
  }, duration);
}

export function fadeOutAndGo(onFinish, duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

 fade.classList.remove("show");  // フェードアウト開始
  fade.style.pointerEvents = "auto";

  setTimeout(() => {
    onFinish?.();
  }, duration);
}

