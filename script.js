// ============================
// 画像リスト
// ============================
const images = [
  "img/img1.jpg",
  "img/img2.jpg",
  "img/img3.jpg"
];

let current = 0;             // 現在の画像
let viewState = "left";      // left = 左半分, right = 右半分

const viewer = document.getElementById("viewer");
const img = document.getElementById("img");

// サイズ・位置
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

  const natW = img.naturalWidth;
  const natH = img.naturalHeight;

  // 高さ基準で90%に拡大
  let scale = (vh * 0.9) / natH;
  let w = natW * scale;
  let h = natH * scale;

  // 横幅が画面の2倍未満なら横基準で拡大
  if(w < vw * 2){
    scale = (vw * 2) / natW;
    w = natW * scale;
    h = natH * scale;
  }

  img.style.width = w + "px";
  img.style.height = h + "px";

  imgW = w;

  // 移動範囲
  maxOffset = 0;             // 左端
  minOffset = vw - imgW;     // 右端

  // 左半分・右半分の位置
  leftOffset = minOffset / 2;
  rightOffset = minOffset;

  setInitialPosition();
};

// ============================
// 初期位置
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
  if(!dragging) return;
  const dx = e.touches[0].clientX - startX;
  let next = offsetX + dx;

  // スライド範囲内は横移動
  next = Math.max(minOffset, Math.min(maxOffset, next));
  offsetX = next;
  img.style.transform = `translate(${offsetX}px, -50%)`;

  startX = e.touches[0].clientX;
});

viewer.addEventListener("touchend", e => {
  dragging = false;
  img.style.transition = "transform 0.25s ease";

  const threshold = vw * 0.25; // ページ切替のしきい値

  // 右端で次の画像
  if(offsetX <= leftOffset - threshold){
    goNext();
  } 
  // 左端で前の画像
  else if(offsetX >= rightOffset + threshold){
    goPrev();
  } 
  // 半分にスナップ
  else {
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
  viewState = "left"; // 次の画像は左半分スタート
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
  current--;
  viewState = "right"; // 戻るときは右半分スタート
  loadImage();
}

// ============================
// 初期ロード
// ============================
loadImage();