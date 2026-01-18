const container = document.getElementById("container");
const viewer = document.getElementById("viewer");
const imgs = container.querySelectorAll("img");

let startX = 0;
let offsetX = 0;
let dragging = false;

let imgW = 0;
let spacing = 0;
let maxOffset = 0;   // 左端
let minOffset = 0;   // 右端（負の値）

// ============================
// 初期値計算
// ============================
function updateValues() {
  imgW = imgs[0].clientWidth;
  spacing = parseInt(getComputedStyle(imgs[0]).marginLeft) + parseInt(getComputedStyle(imgs[0]).marginRight);
  const totalWidth = imgs.length * (imgW + spacing);
  const viewerWidth = viewer.clientWidth;

  // 右の画像が全面表示されるとき、左画像が半分見切れるように調整
  minOffset = Math.min(viewerWidth - totalWidth + (imgW/2 + spacing/2), 0);
  maxOffset = 0;

  // transform が範囲内か調整
  offsetX = Math.max(minOffset, Math.min(maxOffset, offsetX));
  container.style.transform = `translateX(${offsetX}px)`;
}

window.addEventListener("resize", updateValues);
updateValues();

// ============================
// ドラッグ
// ============================
container.addEventListener("touchstart", e => {
  dragging = true;
  startX = e.touches[0].clientX;
  container.style.transition = "none";
});

container.addEventListener("touchmove", e => {
  if (!dragging) return;
  const dx = e.touches[0].clientX - startX;
  offsetX += dx;

  // 左右端の制限
  offsetX = Math.max(minOffset, Math.min(maxOffset, offsetX));

  container.style.transform = `translateX(${offsetX}px)`;
  startX = e.touches[0].clientX;
});

container.addEventListener("touchend", e => {
  dragging = false;
  container.style.transition = "transform 0.2s ease";
});