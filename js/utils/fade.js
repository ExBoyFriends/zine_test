// 冒頭フェードイン
export function fadeInStart(duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  // 初期は黒
  fade.style.opacity = "1";
  fade.style.pointerEvents = "auto";

  // 少し遅らせて透明にする
  requestAnimationFrame(() => {
    fade.style.transition = `opacity ${duration}ms ease`;
    fade.style.opacity = "0";
    fade.style.pointerEvents = "none";
  });
}

// フェードアウトして次の処理へ
export function fadeOutAndGo(onFinish, duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

  // フェードアウト（暗くする）
  fade.style.opacity = "1";
  fade.style.pointerEvents = "auto";
  fade.style.transition = `opacity ${duration}ms ease`;

  setTimeout(() => {
    onFinish?.();
  }, duration);
}

