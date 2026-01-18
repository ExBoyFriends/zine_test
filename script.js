const container = document.getElementById("container");

let startX = 0;
let offsetX = 0;
let dragging = false;
let maxOffset = 0; // 左端
let minOffset = 0; // 右端（負の値）

function updateBounds() {
  const containerWidth = container.scrollWidth;
  const viewerWidth = container.parentElement.clientWidth;
  minOffset = viewerWidth - containerWidth - 20; // 右端少し余白
}

window.addEventListener("resize", updateBounds);
updateBounds();

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