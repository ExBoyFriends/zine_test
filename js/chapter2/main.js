// main.js
import { initLoader } from "./loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import { bindLongPressEvents } from './holdTransition.js';

// 長押しイベントをバインド
const carouselWrapper = document.querySelector('.scene');  // 長押し判定をしたい要素
bindLongPressEvents(carouselWrapper);

const loader = document.getElementById("loader");
initLoader(loader);  // ローダー初期化

// 3D回転の初期化
const carousel = initCarousel3D();

// ドラッグ入力の初期化
initDragInput(carousel);

// 共通対策（chapter1と同じ）
document.addEventListener("contextmenu", e => e.preventDefault());

// ピンチズーム無効（iOS）
document.addEventListener("gesturestart", e => e.preventDefault());
document.addEventListener("gesturechange", e => e.preventDefault());
document.addEventListener("gestureend", e => e.preventDefault());

// ダブルタップズーム無効
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

// URLバー対策
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

// vh対策
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

setVh();
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);


