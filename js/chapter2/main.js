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

const chapter  = document.querySelector(".chapter");
const loader   = document.getElementById("loader");
const dotsWrap = document.querySelector(".dots");
const dots     = [...document.querySelectorAll(".dot")];

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
      location.href = "../HTML/chapter2_5.html";
    }
  });
}
goChapter25._done = false;

const carousel = initCarousel3D({
  onIndexChange(index) {
    updateDots(index);
  },
  onExit() {
    goChapter25();
  }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

initLoader(loader, () => {
  // 1. まず 3D 計算を開始（不透明度 0 なので見えません）
  if (carousel) carousel.start();

  // 2. 3D の初期化が安定し、ブラウザの負荷が下がるまで少し待つ
  setTimeout(() => {
    // 3. 満を持して、滑らかなフェードインを開始
    chapter?.classList.add("visible");
    dotsWrap?.classList.add("visible");
  }, 1200); 

  startAutoTransition(goChapter25);
});

initGlitchLayer?.();

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  goChapter25._done = false;
  window.__carousel__?.stop?.();
});

window.addEventListener("force-exit", () => {
  goChapter25();
});
