// ============================
// 画像リスト
// ============================
const images = [
  "image/king.of.spades.png",
  "image/queen.of.clubs.png",
  "image/jack.of.hearts.png"
];



let current = 0;

const viewer = document.getElementById("viewer");
const img = document.getElementById("img");

let vw, imgW;
let offsetX = 0;
let startX = 0;
let dragging = false;

// ============================
// 画像ロード
// ============================
function loadImage() {
  img.src = images[current];
}

img.onload = () => {
  vw = viewer.clientWidth;
  imgW = img.clientWidth;

  // 初期位置は中央
  offsetX = 0;
  img.style.transition = "none";
  img.style.transform = `translateX(${offsetX}px)`;
  requestAnimationFrame(() => {
    img.style.transition = "transform 0.2s ease";
  });
};

// ============================
// ドラッグ
// ============================
viewer.addEventListener("touchstart", e => {
  dragging = true;
  startX = e.touches[0].clientX;
  img.style.transition = "none";
});

viewer.addEventListener("touchmove", e => {
  if(!dragging) return;
  const dx = e.touches[0].clientX - startX;
  offsetX += dx;

  // 左右端で少し余白
  const maxOffset = 50;
  const minOffset = vw - imgW - 50;
  offsetX = Math.max(minOffset, Math.min(maxOffset, offsetX));

  img.style.transform = `translateX(${offsetX}px)`;
  startX = e.touches[0].clientX;
});

viewer.addEventListener("touchend", e => {
  dragging = false;
  img.style.transition = "transform 0.2s ease";

  // ページ切替判定
  const threshold = vw * 0.25;
  if(offsetX <= vw - imgW - threshold && current < images.length - 1){
    goNext();
  } else if(offsetX >= threshold && current > 0){
    goPrev();
  }
});

// ============================
// ページ切替
// ============================
function goNext(){
  current++;
  loadImage();
}

function goPrev(){
  current--;
  loadImage();
}

// ============================
// 初期ロード
// ============================
loadImage();loadImage()