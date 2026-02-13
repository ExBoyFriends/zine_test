// chapter1/lastPage.js

export function initLastPage(
  wrapper,
  getCurrentPage,
  totalPages,
  transition
) {
  let opened = false;
  
  // 要素を保持する変数
  let elements = null;

  // 必要な時にだけ要素を取得する内部関数
  const getElements = () => {
    if (elements) return elements;
    const lastPage = document.getElementById("last-page");
    if (!lastPage) return null;

    elements = {
      lastPage,
      slideTop: lastPage.querySelector(".slide-top"),
      topHit: lastPage.querySelector(".top-hit"),
      tapCover: lastPage.querySelector(".tap-cover"),
      topLayer: lastPage.querySelector(".top-layer")
    };
    return elements;
  };

  const TRANSITION = "transform 1.4s cubic-bezier(.16,1.3,.3,1)";

  const applyX = x => {
    const el = getElements();
    if (!el) return;
    el.topLayer.style.transition = TRANSITION;
    el.topLayer.style.transform = `translateX(${x}px)`;
  };

  const open = () => {
    if (opened) return;
    const el = getElements();
    if (!el) return;
    opened = true;
    el.lastPage.classList.add("opened");
    const slideWidth = el.slideTop.clientWidth / 2;
    applyX(-slideWidth);
  };

  const close = () => {
    const el = getElements();
    if (!el) return;
    opened = false;
    el.lastPage.classList.remove("opened");
    applyX(0);
  };

  // イベント登録を初期化後に少し遅らせて実行する
  requestAnimationFrame(() => {
    const el = getElements();
    if (!el) return;

    el.topHit.addEventListener("pointerup", e => {
      if (getCurrentPage() !== totalPages - 1) return;
      opened ? close() : open();
    });

    el.tapCover.addEventListener("pointerdown", e => {
      e.preventDefault();
      e.stopPropagation();
      if (!opened) return;
      transition.goNext();
    });

    document.addEventListener("pointerup", () => {
      if (getCurrentPage() !== totalPages - 1 && opened) {
        close();
      }
    });
  });

  return {
    open,
    close,
    isOpened: () => opened
  };
}
