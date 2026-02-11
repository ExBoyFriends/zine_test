// utils/fade.js

export function fadeInStart(duration = 3400) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  if (document.getElementById("loader")?.classList.contains("swallow-darkness")) {
    return;
  }

  fade.classList.remove("hide");
  fade.style.pointerEvents = "auto";
  fade.style.opacity = "1";

  requestAnimationFrame(() => {
    fade.style.transition =
      `opacity ${duration}ms cubic-bezier(.16,1,.3,1)`;
    fade.style.opacity = "0";
  });

  // 少し早めに操作解放（-250ms）
  setTimeout(() => {
    fade.style.pointerEvents = "none";
  }, duration - 250);

  setTimeout(() => {
    fade.classList.add("hide");
  }, duration);
}

