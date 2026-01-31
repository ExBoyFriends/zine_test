/* =====================
   共通対策（全章共通 / Safari最適化）
===================== */

/* ---------- 基本操作の無効化 ---------- */

// 右クリック無効
document.addEventListener("contextmenu", e => e.preventDefault());

// 画像ドラッグ無効
document.addEventListener("dragstart", e => {
  if (e.target.tagName === "IMG") e.preventDefault();
});

/* ---------- iOS Safari：ズーム完全封印 ---------- */

// ダブルタップズーム防止
let lastTouchEnd = 0;
document.addEventListener("touchend", e => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

// ピンチズーム防止
["gesturestart", "gesturechange", "gestureend"].forEach(type => {
  document.addEventListener(type, e => e.preventDefault(), { passive: false });
});

// 画像の長押し・選択防止
document.addEventListener("touchstart", e => {
  if (e.target.tagName === "IMG") e.preventDefault();
}, { passive: false });

/* ---------- URLバー & ビューポート対策 ---------- */

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

// vh 単位の補正（iOS対応）
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

setVh();
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);

/* ---------- Safari 戻る対策（bfcache 完全対応） ---------- */

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // フェード状態を即解除
  document.body.classList.remove("fade-out");

  const fade = document.getElementById("fadeout");
  if (fade) {
    fade.classList.remove("active");
    fade.style.opacity = "0";
    fade.style.pointerEvents = "none";
  }

  // 念のため可視状態を明示
  document.documentElement.style.opacity = "1";
  document.body.style.opacity = "1";

  // スクロール & vh 再計算
  window.scrollTo(0, 0);
  setVh();

  // 必要なら完全初期化（黒画面が出る場合のみON）
  // requestAnimationFrame(() => setTimeout(() => location.reload(), 50));
});
