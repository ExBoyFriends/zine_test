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

// ダブルタップズーム無効（iOS Safari）
let lastTouch = 0;
document.addEventListener(
  "touchend",
  e => {
    const now = Date.now();
    // ダブルタップを検知し、ズームを防止
    if (now - lastTouch <= 300) {
      e.preventDefault();  // ズームを防ぐ
    }
    lastTouch = now;
  },
  { passive: false }
);

// iOS Safari：ピンチズーム無効化
["gesturestart", "gesturechange", "gestureend"].forEach(type => {
  document.addEventListener(type, e => e.preventDefault(), { passive: false });
});

// 画像長押し・選択・浮き出し防止（iOS Safari）
document.addEventListener(
  "touchstart",
  e => {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
    }
  },
  { passive: false }
);

// URLバー非表示対策（横向き時）
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

// vh単位対応（iOSデバイスでのビューポート対応）
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

setVh();
window.addEventListener("resize", setVh);
window.addEventListener("orientationchange", setVh);

// iOSビューのズーム制御（URLバー非表示対応）
if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
  // スクロール位置を調整してURLバーの隠蔽
  window.addEventListener('orientationchange', hideURLBar);
  window.addEventListener('resize', hideURLBar);
}

/* =====================
   Safari 戻る対策（bfcache）
===================== */

window.addEventListener("pageshow", e => {
  if (e.persisted) {
    // フェード・ブラックアウト解除
    document.body.classList.remove("fade-out");

    const fade = document.getElementById("fadeout");
    if (fade) {
      fade.classList.remove("active");
      fade.style.opacity = "0";
      fade.style.pointerEvents = "none";
    }

    // 念のためスクロール位置リセット
    window.scrollTo(0, 0);

    // vh 再計算
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );

    // 🔥 完全に初期状態に戻したいなら（推奨）
    location.reload();
  }
});


