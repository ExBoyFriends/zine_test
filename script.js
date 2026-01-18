// ============================
// 画像リスト
// ============================
const images = [
  "image/king.of.spades.png",
  "image/queen.of.clubs.png"
];

let current = 0;              // 現在表示している画像
let viewState = "left";       // left = 左半分, right = 右半分

const viewer = document.getElementById("viewer");
const img = document.getElementById("img");

// サイズと位置
let vw, imgW;
let minOffset, maxOffset;
let leftOffset, rightOffset;
let offsetX = 0;

// ドラッグ状態
let startX = 0;
let dragging = false;

// ============================
// 画像ロード
// ============================
function loadImage() {
  img.style.visibility = "hidden";
  img.src = images[current];
}

img.onload = () => {
  img.style.visibility = "visible";

  vw = window.innerWidth;
  const vh = window.innerHeight;

  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;

  // 高さ基準でスケール
  let scaleH = (vh * 0.9) / naturalH;
  let displayW = naturalW * scaleH;
  let displayH = naturalH * scaleH;

  // 幅が画面幅の2倍未満なら横基準で拡大
  if(displayW < vw * 2){
    const scaleW = (vw * 2) / naturalW;
    displayW = naturalW * scaleW;
    displayH = naturalH * scaleW;
  }

  img.style.width = displayW + "px";
  img.style.height = displayH + "px";

  imgW = displayW;

  // 移動範囲
  maxOffset = 0;
  minOffset = vw - imgW;

  // 半分見切れ位置
  leftOffset = minOffset / 2;
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
  img.style.transition = "none";
});

viewer.addEventListener("touchmove", e => {
  if (!dragging) return;

  const x = e.touches[0].clientX;
  const dx = x - startX;
  let next = offsetX + dx;

  // スライドできる範囲
  if(next >= leftOffset && next <= rightOffset){
    offsetX = next;
    img.style.transform = `translate(${offsetX}px, -50%)`;
  }

  startX = x;
});

viewer.addEventListener("touchend", () => {
  dragging = false;
  img.style.transition = "transform 0.3s ease";

  // ページ送り判定
  const midpoint = (leftOffset + rightOffset)/2;
  if(offsetX > midpoint){
    goPrev();
  } else if(offsetX < midpoint){
    goNext();
  } else {
    snap();
  }
});

// ============================
// スナップ
// ============================
function snap(){
  offsetX = (viewState === "left") ? leftOffset : rightOffset;
  img.style.transform = `translate(${offsetX}px, -50%)`;
}

// ============================
// ページ送り
// ============================
function goNext(){
  if(current >= images.length - 1){
    snap();
    return;
  }
  current++;
  viewState = "left";  // 次の画像は左半分スタート
  loadImage();
}

// ============================
// ページ戻り
// ============================
function goPrev(){
  if(current <= 0){
    snap();
    return;
  }