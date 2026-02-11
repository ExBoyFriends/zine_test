//chapter1/lastPage.js

import { fadeOutAndGo } from "../utils/fade.js";

export function initLastPage(
  wrapper, 
  getCurrentPage, 
  totalPages,
  transition
  ) {
  
  let opened = false;
  let startX = 0;

  const TAP_THRESHOLD = 6;

  const lastPage = document.getElementById("last-page");
  const slideTop = lastPage?.querySelector(".slide-top");
  const topHit   = lastPage?.querySelector(".top-hit");
  const tapCover = lastPage?.querySelector(".tap-cover");

  if (!lastPage || !slideTop || !topHit || !tapCover) return;

  const TRANSITION =
    "transform 1.4s cubic-bezier(.16,1.3,.3,1)";

  const goChapter2 = () => {
  fadeOutAndGo(() => {
    location.href = "chapter2.html";
  });
};


  const topLayer = lastPage.querySelector(".top-layer");

  const applyX = x => {
    topLayer.style.transition = TRANSITION;
    topLayer.style.transform = `translateX(${x}px)`;
  };

  const open = () => {
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

  topHit.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    if (getCurrentPage() !== totalPages - 1) return;
    startX = e.clientX;
  });

  topHit.addEventListener("pointerup", e => {
    if (getCurrentPage() !== totalPages - 1) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) < TAP_THRESHOLD) {
      e.stopPropagation();
      opened ? close() : open();
    }
  });

 // tapCover のイベントを pointerdown に変更
tapCover.addEventListener("pointerdown", e => {
  e.preventDefault(); // 余計な挙動を防止
  e.stopPropagation();
  if (!opened) return;
  
   transition.goNext();
  });

  document.addEventListener("pointerup", () => {
    if (getCurrentPage() !== totalPages - 1 && opened) {
      close();
    }
  });
}
　

