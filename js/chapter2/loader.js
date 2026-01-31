export function initLoader(loader) {
  const start = () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none"; // ★ ここが重要

      setTimeout(() => {
        loader.style.display = "none";
      }, 4000);
    }, 1200);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
