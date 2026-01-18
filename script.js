// ============================
// 画像リスト
// ============================
const images = [
  "image/king.of.spades.png",
  "image/queen.of.clubs.png",
  "image/jack.of.hearts.png"
];

let current = 0;          // 現在表示中の画像
let viewState = "left";   // left=左半分、right=右半分

const viewer = document.getElementById("viewer");
const img = document.getElementById("img");

// 画像サイズ・スライド範囲
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

  // 高さ基準で画面内に収まるスケール
  let scaleH = (vh * 0.9) / natH;
  let displayW = natW * scaleH;
  let displayH = natH * scaleH;

  // 幅が画面の2倍未満なら横基準で拡大
  if(displayW < vw * 2){
    const scaleW = (vw * 2) / natW;
    displayW = natW * scaleW;
    displayH = natH * scaleW;
  }

  img.style.width = displayW + "px";
  img.style.height = displayH + "px";

  imgW = displayW;

  // スライド範囲
  maxOffset = 0;          // 左端
  minOffset = vw - imgW;  // 右端

  leftOffset = minOffset / 2;  // 左半分表示
  rightOffset = minOffset;     // 右半分表示

  // 初期位置
  offsetX = leftOffset;
  img.style.transition = "none";
  img.style.transform = `translate(${offsetX}px, -50%)`;
  requestAnimationFrame(() => {
    img.style.transition = "transform 0.25s ease";
  });
};

// ============================
// ドラッグ操作
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

  // スライド範囲内
  next = Math.max(minOffset, Math.min(maxOffset, next));
  offsetX = next;
  img.style.transform = `translate(${offsetX}px, -50%)`;

  startX = e.touches[0].clientX;
});

viewer.addEventListener("touchend", e => {
  dragging = false;
  img.style.transition = "transform 0.25s ease";

  const threshold = vw * 0.25;

  // ページ送り判定
  if(offsetX <= leftOffset - threshold){
    goNext();
  } else if(offsetX >= rightOffset + threshold){
    goPrev();
  }
  // 指を離しても位置は戻らない
});

// ============================
// ページ送り
// ============================
function goNext(){
  if(current >= images.length -1) return;
  current++;
  viewState = "left"; // 次の画像は左半分スタート
  loadImage();
}

// ============================
// ページ戻り
// ============================
function goPrev(){
  if(current <= 0) return;
  current--;
  viewState = "right"; // 戻るときは右半分スタート
  loadImage();
}

// ============================
// 初期ロード
// ============================
loadImage();