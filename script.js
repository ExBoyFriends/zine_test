const images = ["img1.jpg", "img2.jpg"];
let current = 0;

// 表示状態
// "left" = 左半分見え
// "right" = 右半分見え
let viewState = "left";

const viewer = document.getElementById("viewer");
const img = document.getElementById("img");

let vw, imgW;
let minOffset, maxOffset;
let initialLeftOffset, initialRightOffset;
let offsetX = 0;

let startX = 0;
let dragging = false;
let mode = "slide"; // slide or page

function setup() {
  vw = window.innerWidth;

  img.onload = () => {
    imgW = img.offsetWidth;

    // 画面には常に半分しか入らない前提
    minOffset = vw - imgW; // 右端
    maxOffset = 0;         // 左端

    // 半分見えの位置
    initialLeftOffset = minOffset / 2;
    initialRightOffset = minOffset;

    applyInitialPosition();
  };
}

function applyInitialPosition() {
  if (viewState === "left") {
    offsetX = initialLeftOffset;
  } else {
    offsetX = initialRightOffset;
  }
  img.style.transform = `translate(${offsetX}px, -50%)`;
}

viewer.addEventListener("touchstart", e => {
  dragging = true;
  startX = e.touches[0].clientX;
  img.style.transition = "none";
  mode = "slide";
});

viewer.addEventListener("touchmove", e => {
  if (!dragging) return;

  const x = e.touches[0].clientX;
  const dx = x - startX;

  let next = offsetX + dx;

  // 右半分まで行ったら「ページモード」
  if (viewState === "left" && next <= initialRightOffset) {
    mode = "slide";
  } else {
    mode = "page";
  }

  if (mode === "slide") {
    next = Math.max(minOffset, Math.min(maxOffset, next));
    img.style.transform = `translate(${next}px, -50%)`;
  }

  startX = x;
  offsetX = next;
});

viewer.addEventListener("touchend", () => {
  dragging = false;
  img.style.transition = "transform 0.3s ease";

  // ページめくり判定
  if (mode === "page") {
    goNext();
  } else {
    snapBack();
  }
});

function snapBack() {
  if (viewState === "left") {
    offsetX = initialLeftOffset;
  } else {
    offsetX = initialRightOffset;
  }
  img.style.transform = `translate(${offsetX}px, -50%)`;
}

function goNext() {
  if (current >= images.length - 1) {
    snapBack();
    return;
  }

  current++;
  viewState = "left";
  img.src = images[current];
  setup();
}

function goPrev() {
  if (current <= 0) return;
  current--;
  viewState = "right";
  img.src = images[current];
  setup();
}

setup();