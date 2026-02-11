/**
 * fade.js (完全版)
 */
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
    fade.style.transition = `opacity ${duration}ms cubic-bezier(.16,1,.3,1)`;
    fade.style.opacity = "0";
  });

  setTimeout(() => {
    fade.style.pointerEvents = "none";
  }, duration - 250);

  setTimeout(() => {
    fade.classList.add("hide");
  }, duration);
}

// transitionManagerで使われる「暗転して移動」
export function fadeOutAndGo(callback, duration = 1000) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    callback?.();
    return;
  }

  fade.classList.remove("hide");
  fade.style.pointerEvents = "auto";
  fade.style.transition = `opacity ${duration}ms ease-in-out`;

  requestAnimationFrame(() => {
    fade.style.opacity = "1";
  });

  setTimeout(() => {
    callback?.();
  }, duration);
}
