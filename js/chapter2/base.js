// js/base.js

/* =====================
   共通対策（全章共通）
===================== */

// 右クリック無効（IMG限定：画像の長押しメニュー防止）
document.addEventListener("contextmenu", e => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

// 画像ドラッグ（抽出）防止
document.addEventListener("dragstart", e => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

// ピンチズーム無効（iOS）
["gesturestart", "gesturechange", "gestureend"].forEach(type => {
  document.addEventListener(type, e => e.preventDefault());
});

// ダブルタップズーム無効（iOS + Android）
let lastTouch = 0;
document.addEventListener(
  "touchend",
  e => {
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault(); // ダブルタップを防ぐ
    lastTouch = now;
  },
  { passive: false }
);

// URLバー対策（横向き）
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

// vh対策（iOS）
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

setVh();
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);

