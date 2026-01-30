// js/chapter2/main.js
import { initLoader } from "./loader.js";
import "./script.js"; // ← 実行するだけ（export 不要）

/* ======================
   loader
====================== */
const loader = document.getElementById("loader");
initLoader(loader);

/* ======================
   共通対策（chapter1 と同じ）
====================== */

// 右クリック無効
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

