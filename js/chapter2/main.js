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

// 初期化関数を共通化（初回ロードと復帰ロードで使用）
function initializeScene() {
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
}

// --- 初回起動 ---
initLoader(loader, initializeScene);

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

// --- 戻るボタン（bfcache）復帰時の処理 ---
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  
  // 1. 出口用の暗転幕（fadeout）を即座に消す
  const fadeout = document.getElementById("fadeout");
  if (fadeout) {
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
    fadeout.classList.remove("active");
  }

  // 2. 状態フラグとカルーセルのリセット
  transitionDone = false; 
  resetTransitionState();
  if (window.__carousel__) {
    window.__carousel__.stop?.();
    // ここで start は呼ばない（loader完了を待つ）
  }

  // 3. 他のチャプターと同じように Loader を再表示して演出をやり直す
  const ld = document.getElementById("loader") || loader;
  if (ld) {
    // スタイルを初期状態へ戻す
    ld.style.display = "flex";
    ld.style.opacity = "1";
    ld.classList.remove("swallow-darkness", "reveal-start");

    // 4. 再び initLoader を実行して、4.2秒の鼓動演出から再開
    initLoader(ld, initializeScene);
  }
});
