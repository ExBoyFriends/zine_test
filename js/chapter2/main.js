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

  // カルーセルの回転を維持したまま暗転幕を被せる
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

// 戻るボタン（bfcache）対策の完全版
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  
  // 1. カルーセルを覆っている「暗転幕」と「ローダー」を強制排除
  // これが残っていると画面が真っ暗で固まったように見える
  const fadeout = document.getElementById("fadeout");
  if (fadeout) {
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
    fadeout.classList.remove("active");
  }

  const ld = document.getElementById("loader");
  if (ld) {
    ld.style.display = "none";
  }
  
  // 2. 状態フラグのリセット
  transitionDone = false; 
  resetTransitionState();
  
  // 3. カルーセルの再始動
  if (window.__carousel__) {
    window.__carousel__.stop?.();
    window.__carousel__.start?.(); 
  }
  
  // 4. 自動遷移タイマーの再登録
  startAutoTransition(goChapter25);
});
