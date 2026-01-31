/* =====================
   共通対策（全章共通）
===================== */

// 右クリック無効（画像含む）
document.addEventListener("contextmenu", e => {
  e.preventDefault();
});

// 画像ドラッグ無効
document.addEventListener("dragstart", e => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

// iOS ピンチズーム無効
["gesturestart", "gesturechange", "gestureend"].forEach(type => {
  document.addEventListener(type, e => e.preventDefault());
});

// ダブルタップズーム無効
let lastTouch = 0;
document.addEventListener(
  "touchend",
  e => {
    const now = Date.now();
    if (now - lastTouch <= 300) {
      e.preventDefault();
    }
    lastTouch = now;
  },
  { passive: false }
);

// iOS Safari：画像長押し・選択・浮き出し完全防止（決定打）
document.addEventListener(
  "touchstart",
  e => {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
    }
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

// iOSのビューのズーム制御
if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
  // スクロール位置を調整してURLバーの隠蔽
  window.addEventListener('orientationchange', hideURLBar);
  window.addEventListener('resize', hideURLBar);
}




