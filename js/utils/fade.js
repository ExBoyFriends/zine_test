// utils/fade.js

// フェードアウト（黒くして onFinish）
export function fadeOutAndGo(onFinish, duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

  fade.classList.remove("hide"); // 黒表示
  fade.style.transition = `opacity ${duration}ms ease`;
  fade.style.opacity = 1;

  setTimeout(() => {
    onFinish?.();
  }, duration);
}

// 冒頭フェードイン（黒→透明）
export function fadeInStart(duration = 800) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  fade.classList.remove("hide"); // 黒表示
  fade.style.opacity = 1;
  fade.style.pointerEvents = "none";

  requestAnimationFrame(() => {
    fade.style.transition = `opacity ${duration}ms ease`;
    fade.style.opacity = 0; // 透明化
  });

  setTimeout(() => {
    fade.style.transition = "";
    fade.classList.add("hide"); // class削除で次のfadeOutに備える
  }, duration);
}
