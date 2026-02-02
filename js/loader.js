/* loader.js */

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;

    loader.style.display = "none";
    onComplete?.();
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    setTimeout(() => {
      requestAnimationFrame(() => {
        loader.style.opacity = "0";
      });

      loader.addEventListener("transitionend", finish, { once: true });
       setTimeout(finish, 6500);
    }, 2000); //保険
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
