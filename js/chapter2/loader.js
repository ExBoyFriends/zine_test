export function initLoader(loader) {
  const start = () => {
    setTimeout(() => {
      loader.style.opacity = "0";

      // ★ フォールバックで確実に消す
      setTimeout(() => {
        loader.style.display = "none";
      }, 4000); // transition(3.5s) + α
    }, 1200);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
