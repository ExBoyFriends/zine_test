// main.js
import { initLoader } from "./loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";

/* =====================
   Loader
===================== */
const loader = document.getElementById("loader");
initLoader(loader);

/* =====================
   Carousel
===================== */
const carousel = initCarousel3D();
initDragInput(carousel);

/* =====================
   Chapter2 → 2.5 遷移
===================== */
const scene = document.querySelector(".scene");

const goChapter25 = () => {
  playExitTransition({
    onComplete: () => {
      location.href = "chapter2_5.html";
    }
  });
};

/* =====================
   表示完了後に開始
===================== */
window.addEventListener("pageshow", () => {
  resetTransitionState();
  startAutoTransition(goChapter25);
  bindLongPressEvents(scene);
});

/* =====================
   共通対策
===================== */
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("gesturestart", e => e.preventDefault());
document.addEventListener("gesturechange", e => e.preventDefault());
document.addEventListener("gestureend", e => e.preventDefault());

let lastTouch = 0;
document.addEventListener(
  "touchend",
  e => {
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  },
  { passive: false }
);

/* URLバー対策 */
const hideURLBar = () => {
  if (window.matchMedia("(orientation: landscape)").matches) {
    window.scrollTo(0, 1);
  }
};

["orientationchange", "resize", "visibilitychange"].forEach(event => {
  window.addEventListener(event, () => {
    setTimeout(hideURLBar, 300);
  });
});

/* vh対策 */
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

setVh();
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);

