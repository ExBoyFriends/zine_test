export function initLoader(loader) {
  if (!loader) return;

  const hide = () => {
    loader.style.transition = "opacity 3.5s ease";
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.style.display = "none";
    }, 3500);
  };

  // 常に同じ挙動
  loader.style.display = "block";
  loader.style.opacity = "1";
  loader.style.pointerEvents = "auto";

  // 少し待って必ず消す
  setTimeout(hide, 1200);
}

