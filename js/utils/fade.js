export function fadeOutAndGo(onFinish, duration = 800) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

  // フェードアウト開始（暗くなる）
  fade.classList.remove("show");

  setTimeout(() => {
    onFinish?.();
  }, duration);
}
