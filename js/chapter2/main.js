// main.js
import { initLoader } from "./loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";

/* Loader */
const loader = document.getElementById("loader");
initLoader(loader);

/* Carousel */
const carousel = initCarousel3D();
initDragInput(carousel);

/* 遷移 */
const scene = document.querySelector(".scene");

const goChapter25 = () => {
  const DURATION = 2000;
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / DURATION, 1);
    const eased = t * t * t; // 後半ほど急加速

    carousel.setFadeBoost(eased);

    document.body.style.backgroundColor =
      `rgba(0,0,0,${eased})`;

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      location.href = "chapter2_5.html";
    }
  }

  requestAnimationFrame(tick);
};

/* 表示後に必ず再スタート */
window.addEventListener("pageshow", () => {
  resetTransitionState();
  startAutoTransition(goChapter25);
  bindLongPressEvents(scene);
});

/* 共通対策 */
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("gesturestart", e => e.preventDefault());
document.addEventListener("gesturechange", e => e.preventDefault());
document.addEventListener("gestureend", e => e.preventDefault());

let lastTouch = 0;
document.addEventListener("touchend", e => {
  const now = Date.now();
  if (now - lastTouch <= 300) e.preventDefault();
  lastTouch = now;
}, { passive: false });

function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}
setVh();
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);
