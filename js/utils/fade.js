// utils/fade.js

export function fadeInStart(duration = 2800) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  if (document.getElementById("loader")?.classList.contains("swallow-darkness")) {
    return;
  }

  fade.classList.remove("hide");
  fade.style.pointerEvents = "auto";
  fade.style.opacity = "1";

  requestAnimationFrame(() => {
    fade.style.transition = `opacity ${duration}ms cubic-bezier(.22,.61,.36,1)`;
    fade.style.opacity = "0";
  });

  // ★ 操作解放を少し早める（-200ms）
  const unlockTime = duration - 200;

  setTimeout(() => {
    fade.style.pointerEvents = "none";
  }, unlockTime);

  setTimeout(() => {
    fade.classList.add("hide");
  }, duration);
}

