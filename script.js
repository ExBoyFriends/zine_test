const images = [
  "img1.jpg",
  "img2.jpg"
];

let current = 0;

// left = 左半分が見える
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

function loadImage() {
  img.src = images[current];
}

img.onload = () => {
  vw = window.innerWidth;
  imgW = img.offsetWidth;

  // 左右の限界
  maxOffset = 0;
  minOffset = vw - imgW;

  // 半分見切れの位置
  leftOffset  = minOffset / 2; // 左半分
  rightOffset = minOffset;     // 右半分

  setInitialPosition();
};

function setInitialPosition() {
  offsetX = (viewState === "left") ? leftOffset : rightOffset;
  img.style.transition = "none";
  img.style.transform = `translate(${offsetX}px, -50%)`;
  requestAnimationFrame(() => {
    img.style.transition = "transform 0.25s ease";
  });
}

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

  // スライドできる範囲
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
    // ページ切り替え
    if (offsetX <= leftOffset) {
      goPrev();
    } else {
      goNext();
    }
  } else {
    snap();
  }
});

function snap() {
  offsetX = (viewState === "left") ? leftOffset : rightOffset;
  img.style.transform = `translate(${offsetX}px, -50%)`;
}

function goNext() {
  if (current >= images.length - 1) {
    snap();
    return;
  }
  current++;
  viewState = "left";
  loadImage();
}

function goPrev() {
  if (current <= 0) {
    snap();
    return;
  }
  current--;
  viewState = "right";
  loadImage();
}

loadImage();