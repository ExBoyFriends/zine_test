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
const dots    = [...document.querySelectorAll(".dot")];

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
  onIndexChange(index) { updateDots(index); },
  onExit() { goChapter25(); }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

initLoader(loader, () => {
  if (carousel) {
    carousel.reset(0.22);
    carousel.start();
    chapter?.classList.add("visible");
    startAutoTransition(goChapter25);
  }
});

initGlitchLayer?.();

// 戻ってきた時の処理を修正統合
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  
  // 状態とフラグのリセット
  resetTransitionState();
  goChapter25._done = false;
  
  // カルーセルの速度とモードをリセットして再開
  if (window.__carousel__) {
    window.__carousel__.stop();
    window.__carousel__.reset(0.22);
    window.__carousel__.start();
  }

  // 見た目のリセット
  if (chapter) {
    chapter.style.opacity = "1";
    chapter.classList.add("visible");
  }
  const overlay = document.getElementById("fadeout");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.classList.remove("active");
  }

  // 自動遷移タイマーを再始動
  startAutoTransition(goChapter25);
});

bindLongPressEvents(document.body);
