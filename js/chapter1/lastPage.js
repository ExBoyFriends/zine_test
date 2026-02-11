
// chapter1/lastPage.js

export function initLastPage(
  wrapper,
  getCurrentPage,
  totalPages,
  transition
) {

  let opened = false;

  const lastPage = document.getElementById("last-page");
  const slideTop = lastPage?.querySelector(".slide-top");
  const topHit   = lastPage?.querySelector(".top-hit");
  const tapCover = lastPage?.querySelector(".tap-cover");
  const topLayer = lastPage?.querySelector(".top-layer");

  if (!lastPage || !slideTop || !topHit || !tapCover || !topLayer) return;

  const TRANSITION =
    "transform 1.4s cubic-bezier(.16,1.3,.3,1)";

  const applyX = x => {
    topLayer.style.transition = TRANSITION;
    topLayer.style.transform = `translateX(${x}px)`;
  };

  const open = () => {
    if (opened) return;
    opened = true;
    lastPage.classList.add("opened");
    const slideWidth = slideTop.clientWidth / 2;
    applyX(-slideWidth);
  };

  const close = () => {
    opened = false;
    lastPage.classList.remove("opened");
    applyX(0);
  };

  topHit.addEventListener("pointerup", e => {
    if (getCurrentPage() !== totalPages - 1) return;
    opened ? close() : open();
  });

  tapCover.addEventListener("pointerdown", e => {
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

  return {
    open,
    close,
    isOpened: () => opened
  };
}


