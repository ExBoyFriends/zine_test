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

// 1. カルーセルを即座に作成（まだ start はしない）
const carousel = initCarousel3D({
  onIndexChange(index) { updateDots(index); },
  onExit() { goChapter25(); }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

function goChapter25() {
  if (transitionDone) return;
  transitionDone = true;
  playExitTransition({
    onFinish() { location.href = "../HTML/chapter2_5.html"; }
  });
}

// 2. 本編を「点火」する関数
function initializeScene() {
  console.log("Scene Initializing..."); // ログで確認
  if (chapter) chapter.classList.add("visible");
  if (dotsWrap) dotsWrap.classList.add("visible");

  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }

  startAutoTransition(goChapter25);
  
  if (window.__carousel__) {
    window.__carousel__.stop(); // 念のため
    window.__carousel__.start(); // ここで animate() が回り出す
    console.log("Carousel Started");
  }
}

// 3. 【重要】Loaderを待つが、万が一のために「自力」でも動くようにする
if (loader) {
  initLoader(loader, initializeScene);
  
  // 保険：Loaderが4.2秒+α経っても initializeScene を呼ばなかったら強制実行
  setTimeout(() => {
    if (window.__carousel__ && !chapter.classList.contains("visible")) {
      console.warn("Loader timed out. Force starting...");
      initializeScene();
      loader.style.display = "none";
    }
  }, 6000); 
} else {
  // Loaderがない場合は即点火
  initializeScene();
}

initGlitchLayer?.();

// --- 戻るボタン（bfcache）対策 ---
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  
  const fadeout = document.getElementById("fadeout");
  if (fadeout) {
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
    fadeout.classList.remove("active");
  }

  transitionDone = false;
  resetTransitionState();

  // 戻った時も「Loaderがある状態」からやり直したい場合
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
