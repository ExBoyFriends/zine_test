/*  loader.js */

export function initLoader(loader, onComplete) {
  let finished = false;

  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    onComplete?.();
  };

  const finish = () => {
    if (finished) return;

    if (loader) {
      loader.style.animation = "none";
      loader.style.opacity = "0";
      loader.style.display = "none";
    }

    if (fadeLayer) {
      fadeLayer.classList.add("hide");
      fadeLayer.style.pointerEvents = "none";
    }

    requestAnimationFrame(safeComplete);
  };

  const start = () => {
    if (finished) return;

    if (loader) {
      loader.style.display = "block";
      loader.style.opacity = "1";
      loader.style.animation = "siren 2s linear infinite";
    }

    fadeLayer?.classList.remove("hide");

    setTimeout(finish, 4200);
  };

    if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  // bfcache
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    if (loader) {
      loader.style.display = "none";
      loader.style.opacity = "0";
      loader.style.animation = "none";
    }

    fadeLayer?.classList.add("hide");
    safeComplete();
  });
}
