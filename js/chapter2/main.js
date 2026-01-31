// main.js
import { initLoader } from "./loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import { bindLongPressEvents } from "./holdTransition.js";

// loader
const loader = document.getElementById("loader");
initLoader(loader);

// carousel
const carousel = initCarousel3D();
initDragInput(carousel);

// 長押し・自動遷移
const scene = document.querySelector(".scene");
bindLongPressEvents(scene, () => {
  console.log("Chapter 2.5 へ移行");
    location.href = "../chapter2_5/index.html";
});

// 以下は共通対策だけ（OK）
document.addEventListener("contextmenu", e => e.preventDefault());
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


