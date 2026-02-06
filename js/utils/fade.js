// utils/fade.js

export function fadeInStart(duration = 2800) { // 2.8sに統一
  const fade = document.getElementById("fadeLayer");
  if (!fade) return;

  // ローダー実行中（swallow-darknessクラスがある時）は、
  // loader.js側の演出を優先させるため、ここでは何もしない
  if (document.getElementById("loader")?.classList.contains("swallow-darkness")) {
    return;
  }

  fade.classList.remove("hide");
  fade.style.opacity = "1";

  requestAnimationFrame(() => {
    // base.cssのイージングと一致させる
    fade.style.transition = `opacity ${duration}ms cubic-bezier(.22,.61,.36,1)`;
    fade.style.opacity = "0";
  });

  setTimeout(() => {
    fade.classList.add("hide");
    fade.style.pointerEvents = "none";
  }, duration);
}

export function fadeOutAndGo(onFinish, duration = 1500) {
  const fade = document.getElementById("fadeLayer");
  if (!fade) {
    onFinish?.();
    return;
  }

  fade.classList.remove("hide");
  fade.style.opacity = "0";
  fade.style.pointerEvents = "auto"; // 操作をロック
  
  requestAnimationFrame(() => {
    fade.style.transition = `opacity ${duration}ms ease`;
    fade.style.opacity = "1";
  });

  setTimeout(() => {
    onFinish?.();
  }, duration);
}
