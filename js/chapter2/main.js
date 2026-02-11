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

let transitionDone = false;

// カルーセルの初期化
const carousel = initCarousel3D({
  onIndexChange(index) {
    const reversedIndex = (dots.length - 1) - index;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === reversedIndex));
  },
  onExit() { goChapter25(); }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
}

function goChapter25() {
  if (transitionDone) return;
  transitionDone = true;
  playExitTransition({
    onFinish() { location.href = "../HTML/chapter2_5.html"; }
  });
}

function initializeScene() {
  if (chapter) chapter.classList.add("visible");
  if (dotsWrap) dotsWrap.classList.add("visible");
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }
  startAutoTransition(goChapter25);
  // エンジン始動
  if (window.__carousel__) {
    window.__carousel__.start();
  }
}

// 初回起動
initLoader(loader, initializeScene);
initGlitchLayer?.();

// 戻るボタン（bfcache）対策：すべてのゴミを掃除して再点火
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // 1. 出口の幕を強制排除
  const fadeout = document.getElementById("fadeout");
  if (fadeout) {
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
    fadeout.classList.remove("active");
  }

  // 2. 状態とエンジンの完全停止
  transitionDone = false;
  resetTransitionState();
  if (window.__carousel__) {
    window.__carousel__.stop();
    window.__carousel__.reset(16); // EXIT_MAXから急減速させる演出
  }

  // 3. ローダーを再表示して再初期化
  const ld = document.getElementById("loader");
  if (ld) {
    ld.style.display = "flex";
    ld.style.opacity = "1";
    ld.classList.remove("swallow-darkness", "reveal-start");
    initLoader(ld, initializeScene);
  } else {
    initializeScene();
  }
});
