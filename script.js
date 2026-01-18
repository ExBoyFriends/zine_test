// ============================
// 設定
// ============================
const images = [
  "img/img1.jpg",
  "img/img2.jpg"
];

// ============================
// 状態
// ============================
let current = 0;

// left  = 左半分が見える
// right = 右半分が見える
let viewState = "left";

const viewer = document.getElementById("viewer");
const img = document.getElementById("img");

let vw, imgW;
let minOffset, maxOffset;
let leftOffset, rightOffset;
let offsetX = 0;

let startX = 0;
let dragging = false;
let mode = "slide"; // slide / page

// ============================
// 初期ロード
// ============================
function loadImage() {
  img.style.visibility = "hidden";
  img.src = images[current];
}

// 画像が読み込まれたら毎回ここに入る
img.onload = () => {
  img.style.visibility = "visible";

  vw = window.innerWidth;
  const vh = window.innerHeight;

  // 高さ基準で一度サイズを決める
  const scale = (vh * 0.9) / img.naturalHeight;
  const displayWidth = img.naturalWidth * scale;

  // もし横幅が画面より小さかったら、横基準で拡大し直す
  if (displayWidth < vw * 2) {
    const scaleW = (vw * 2) / img.naturalWidth;
    img.style.height = "auto";
    img.style.width = img.naturalWidth * scaleW + "px";
  } else {
    img.style.height = vh * 0.9 + "px";
    img.style.width = "auto";
  }

  imgW = img.getBoundingClientRect().width;

  // 移動範囲
  maxOffset = 0;
  minOffset = vw - imgW;

  // 半分見切れ位置
  leftOffset  = minOffset / 2;
  rightOffset = minOffset;

  setInitialPosition();
};

// ============================
// 初期位置セット
// ============================
function setInitialPosition() {
  offsetX = (viewState === "left") ? leftOffset : rightOffset;
  img.style.transition = "none";
  img.style.transform = `translate(${offsetX}px, -50%)`;

  requestAnimationFrame(() => {
    img.style.transition = "transform 0.25s ease";
  });
}

// ============================
// タッチ操作
// ============================
viewer.addEventListener("touchstart", e => {
  dragging = true;
  startX = e.touches[0].clientX;
  mode = "slide";
  img.style.transition = "none";
});

viewer.addEventListener("touchmove", e => {
  if (!dragging) return;

  const x = e.touches[0].clientX;
  const dx = x - startX;
  let next = offsetX + dx;

  // スライドできる範囲：左半分～右半分
  if (next >= leftOffset && next <= rightOffset) {
    mode = "slide";
    next = Math.max(minOffset, Math.min(maxOffset, next));
    img.style.transform = `translate(${next}px, -50%)`;
    offsetX = next;
  } else {
    mode = "page";
  }

  startX = x;
});

viewer.addEventListener("touchend", () => {
  dragging = false;
  img.style.transition = "transform 0.3s ease";

  if (mode === "page") {
    // どちら側に寄っているかで進む／戻る
    if (offsetX <= leftOffset) {
      goPrev();
    } else {
      goNext();
    }
  } else {
    snap();
  }
});

// ============================
// 位置を半分状態に戻す
// ============================
function snap() {
  offsetX = (viewState === "left") ? leftOffset : rightOffset;
  img.style.transform = `translate(${offsetX}px, -50%)`;
}

// ============================
// ページ送り
// ============================
function goNext() {
  if (current >= images.length - 1) {
    snap();
    return;
  }
  current++;
  viewState = "left";
  loadImage();
}

// ============================
// ページ戻り
// ============================
function goPrev() {
  if (current <= 0) {
    snap();
    return;
  }
  current--;
  viewState = "right";
  loadImage();
}

// ============================
// 開始
// ============================
loadImage();