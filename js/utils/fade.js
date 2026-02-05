// utils/fade.js

// フェードアウトして次の処理へ
export function fadeOutAndGo(onFinish, duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

  fade.style.pointerEvents = "auto";
  fade.classList.add("show"); // 黒くフェードイン（遷移用）

  setTimeout(() => {
    onFinish?.();
  }, duration);
}

// 冒頭フェードイン（黒→透明）
export function fadeInStart(duration = 800) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  fade.classList.add("show");      // 初期は黒
  fade.style.pointerEvents = "none";

  requestAnimationFrame(() => {
    fade.style.transition = `opacity ${duration}ms ease`;
    fade.style.opacity = 0;        // 透明化
  });

  setTimeout(() => {
    fade.style.transition = "";
    fade.classList.remove("show"); // class削除で次のfadeOutに備える
    fade.style.opacity = 1;        // 元に戻す
  }, duration);
}
