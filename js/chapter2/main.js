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

// --- カルーセル初期化 ---
const carousel = initCarousel3D({
  onIndexChange(index) { updateDots(index); },
  onExit() { goChapter25(); }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

// --- ローダー完了後シーケンス ---
initLoader(loader, () => {
  const cylinder = document.querySelector(".main-cylinder");
  if (carousel && cylinder) {
    carousel.reset(0.22);
    carousel.start();
    void cylinder.offsetWidth; // リフロー
    requestAnimationFrame(() => requestAnimationFrame(() => {
      chapter?.classList.add("visible");
      cylinder.classList.add("cylinder-ready");
      dotsWrap?.classList.add("visible");
    }));
  }
  startAutoTransition(goChapter25);
});

initGlitchLayer?.();

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  goChapter25._done = false;
  window.__carousel__?.stop?.();
});

window.addEventListener("force-exit", () => { goChapter25(); });

// --- 長押しイベントを body にバインド ---
bindLongPressEvents(document.body);

