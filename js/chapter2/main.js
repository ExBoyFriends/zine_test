// chapter2/main.js

import "../utils/base.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";
import { initGlitchLayer } from "./effects.js";

const scene    = document.querySelector(".scene");
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

let transitionDone = false;
function goChapter25() {
  if (transitionDone) return;
  transitionDone = true;

  playExitTransition({
    onFinish() {
      location.href = "../HTML/chapter2_5.html";
    }
  });
}

initLoader(loader, () => {
  startChapter({
    chapter,
    dots: dotsWrap,
    onStart() {
      if (scene && !scene.__holdBound) {
        bindLongPressEvents(scene);
        scene.__holdBound = true;
      }
      startAutoTransition(goChapter25);
      if (window.__carousel__?.start) window.__carousel__.start();
    }
  });
});

const carousel = initCarousel3D({
  onIndexChange(index) { updateDots(index); },
  onExit() { goChapter25(); }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

initGlitchLayer?.();

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  transitionDone = false; // フラグリセット
  
  if (window.__carousel__) {
    window.__carousel__.stop?.();
    window.__carousel__.start?.(); 
  }
  // 自動遷移タイマーを再始動
  startAutoTransition(goChapter25);
});
