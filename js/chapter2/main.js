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
  const PAUSE_DELAY   = 1200; // タイマー後の静止
  const FADE_DURATION = 3000; // フェード（やや長めで余韻）
  const BLACK_HOLD    = 400;  // 真っ暗な時間

  setTimeout(() => {
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / FADE_DURATION, 1);

      /*
        加速カーブ：
        前半ほぼ止まる → 後半で一気に現実
      */
      const accel =
        t < 0.45
          ? t * 0.08
          : Math.pow((t - 0.45) / 0.55, 3.2);

      // 回転をジョジョに壊す
      carousel.setFadeBoost(accel);

      // フェード（完全暗転まで）
      document.body.style.backgroundColor =
        `rgba(0,0,0,${t})`;

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // 🌑 完全暗転後、少しだけ間を置く
        setTimeout(() => {
          location.href = "chapter2_5.html";
        }, BLACK_HOLD);
      }
    }

    requestAnimationFrame(tick);
  }, PAUSE_DELAY);
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
