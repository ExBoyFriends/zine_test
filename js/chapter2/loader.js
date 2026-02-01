//chapter2

export function initLoader(loader) {
  if (!loader) return;

  // 初期状態
  loader.classList.remove("hide");
  loader.style.display = "block";

  // 一定時間後にフェードアウト
  setTimeout(() => {
    loader.classList.add("hide");

    // 完全にDOMから切る
    setTimeout(() => {
      loader.style.display = "none";
    }, 3500);
  }, 1200);
}

