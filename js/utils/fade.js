// utils/fade.js
export function fadeInStart(duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  fade.classList.remove("hide"); // 黒 → 表示
  fade.style.opacity = "1";

  requestAnimationFrame(() => {
    fade.style.transition = `opacity ${duration}ms ease`;
    fade.style.opacity = "0";
  });

  setTimeout(() => {
    fade.classList.add("hide");
    fade.style.pointerEvents = "none";
  }, duration);
}

export function fadeOutAndGo(onFinish, duration = 1200) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

  fade.classList.remove("hide");
  fade.style.opacity = "0";
  requestAnimationFrame(() => {
    fade.style.transition = `opacity ${duration}ms ease`;
    fade.style.opacity = "1";
  });

  setTimeout(() => {
    onFinish?.();
  }, duration);
}

