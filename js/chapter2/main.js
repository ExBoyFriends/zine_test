// chapter2/main.js
import "../utils/base.js";
import { initLoader } from "../utils/loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";
import { initGlitchLayer } from "./effects.js";

const chapter = document.querySelector(".chapter");
const loader  = document.getElementById("loader");
const dotsWrap = document.querySelector(".dots");
const dots    = [...document.querySelectorAll(".dot")];

let carousel = null;

function updateDots(index = 0) {
  const COUNT = dots.length;
  const reversedIndex = (COUNT - 1) - index;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === reversedIndex);
  });
}

function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;
  playExitTransition({
    onFinish() {
      chapter?.classList.remove("visible", "active");
      location.href = "../HTML/chapter2_5.html";
    }
  });
}
goChapter25._done = false;

// 初期状態のドット
updateDots(0);

// ローダー開始
initLoader(loader, () => {
  carousel = initCarousel3D({
    onIndexChange(index) { updateDots(index); },
    onExit() { goChapter25(); }
  });

  if (carousel && chapter) {
    window.__carousel__ = carousel;
    initDragInput(carousel);
    
    carousel.reset(0.22);
    carousel.start();

    requestAnimationFrame(() => {
      chapter.classList.add("visible");
      dotsWrap?.classList.add("visible");
    });
    
    startAutoTransition(goChapter25);
  }
});

initGlitchLayer?.();
bindLongPressEvents(document.body);

// bfcache対応（戻るボタンで戻った時の処理）
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  resetTransitionState();
  goChapter25._done = false;

  if (chapter) {
    chapter.classList.add("active");
    chapter.style.opacity = "1";
    requestAnimationFrame(() => chapter.classList.add("visible"));
  }

  if (window.__carousel__) {
    window.__carousel__.stop();
    window.__carousel__.reset(0.22);
    window.__carousel__.start();
  }

  if (dotsWrap) {
    dotsWrap.classList.add("visible");
    dotsWrap.style.opacity = "1";
  }
  
  const overlay = document.getElementById("fadeout");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.classList.remove("active");
  }

  startAutoTransition(goChapter25);
});
