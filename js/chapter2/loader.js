export function initLoader(loader) {
  const start = () => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        loader.style.opacity = "0";
      });

      loader.addEventListener(
        "transitionend",
        () => {
          loader.style.display = "none";
        },
        { once: true }
      );
    }, 1200);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

