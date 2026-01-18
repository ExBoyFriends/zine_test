// ============================
// 画像リスト
// ============================
const images = [
  "image/king.of.spades.png",
  "image/queen.of.clubs.png",
  "image/jack.of.hearts.png"
];

let current = 0;
let viewState = "left";

const viewer = document.getElementById("viewer");
const img = document.getElementById("img");

let vw, imgW;
let minOffset, maxOffset;
let leftOffset, rightOffset;
let offsetX = 0;

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

  let scaleH = (vh * 0.9) / natH;
  let displayW = natW * scaleH;
  let displayH = natH * scaleH;

  if(displayW < vw * 2){
    const scaleW = (vw * 2) / natW;
    displayW = natW * scaleW;
    displayH = natH * scaleW;
  }

  img.style.width = displayW + "px";
  img.style.height = displayH + "px";

  imgW = displayW;

  maxOffset = 0;
  minOffset = vw - imgW;

  leftOffset = minOffset / 2;
  rightOffset = minOffset;

  offsetX = (viewState === "left") ? leftOffset : rightOffset;
  img.style.transition = "none";
  img.style.transform = `translate(${offsetX}px, -50%)`;
  requestAnimationFrame(() => {
    img.style.transition = "transform 0.3s ease";
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
  let next = offsetX + dx;

  offsetX = next;
  img.style.transform = `translate(${offsetX}px, -50%)`;

  startX = e.touches[0].clientX;
});

viewer.addEventListener("touchend", e => {
  dragging = false;
  img.style.transition = "transform 0.3s ease";

  // 折り返し判定
  if(offsetX < rightOffset - vw * 0.1 && current < images.length -1){
    // 右端を超えたら次の画像に折り返し
    flipNext();
  } else if(offsetX > leftOffset + vw * 0.1 && current > 0){
    // 左端を超えたら前の画像に折り返し
    flipPrev();
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
// ページめくり（折り返し）
function flipNext(){
  // アニメーションで右側から次の画像が出る
  img.style.transition = "transform 0.3s ease";
  img.style.transform = `translate(${minOffset - 50}px, -50%)`; // 少し押し出す演出

  setTimeout(()=>{
    current++;
    viewState = "left";
    loadImage();
  }, 200); // 次の画像表示
}

function flipPrev(){
  img.style.transition = "transform 0.3s ease";
  img.style.transform = `translate(${50}px, -50%)`;

  setTimeout(()=>{
    current--;
    viewState = "right";
    loadImage();
  }, 200);
}

// ============================
// 初期ロード
// ============================
loadImage()