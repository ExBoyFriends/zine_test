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

// カルーセルの初期化（後で再利用するため変数に保持）
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
    onFinish() {
      location.href = "../HTML/chapter2_5.html";
    }
  });
}

// 本編を開始させるコア関数
function initializeScene() {
  // 1. 本編の表示状態をリセット
  if (chapter) chapter.classList.add("visible");
  if (dotsWrap) dotsWrap.classList.add("visible");

  // 2. イベントバインド
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }

  // 3. 重要：自動遷移タイマーと回転の「再始動」
  startAutoTransition(goChapter25);
  if (window.__carousel__) {
    window.__carousel__.stop?.(); // 二重起動防止
    window.__carousel__.start?.(); // ここで requestAnimationFrame が動き出す
  }
}

// 初回ロード実行
initLoader(loader, initializeScene);

initGlitchLayer?.();

/* ========================================================
   戻るボタン（bfcache）復帰時の完全リセット
   ======================================================== */
window.addEventListener("pageshow", e => {
  // 戻るボタンでの復帰時のみ実行
  if (!e.persisted) return;

  // 1. 出口用の幕（fadeout）を強制排除
  const fadeout = document.getElementById("fadeout");
  if (fadeout) {
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
    fadeout.classList.remove("active");
  }

  // 2. 論理状態のリセット
  transitionDone = false;
  resetTransitionState();

  // 3. ローダーの見た目を「他のチャプターと同じ」に戻す
  const ld = document.getElementById("loader");
  if (ld) {
    ld.style.display = "flex";
    ld.style.opacity = "1";
    ld.classList.remove("swallow-darkness", "reveal-start");
    
    // 4. 他のチャプターと同じ loader 演出を再実行し、終わったら initializeScene を呼ぶ
    // もし loader.js のフラグが原因で initializeScene が呼ばれない場合に備え、
    // ここで直接「再点火」を予約する
    initLoader(ld, initializeScene);
    
    // loader.js が動かない時用の強制再起動タイマー
    setTimeout(() => {
      if (window.__carousel__ && !transitionDone) {
        // まだ動いていなければ強制スタート
        initializeScene();
        // 幕を消す
        ld.style.opacity = "0";
        setTimeout(() => { ld.style.display = "none"; }, 500);
      }
    }, 4500); 

  } else {
    // ローダー要素自体がない場合は、即座に再起動
    initializeScene();
  }
});
