const cylinder = document.getElementById("cylinder");
const outers = document.querySelectorAll(".panel.outer");
const inners = document.querySelectorAll(".panel.inner");

let dragging = false;
let lastX = 0;
let velocity = 0;
let rotationY = 0;

/* カメラ */
let cameraZ = 300;
let targetZ = -180;

const DAMPING = 0.92;
const SNAP = 72;

/* 入場演出 */
let intro = true;
setTimeout(() => intro = false, 1200);

const start = x => {
  dragging = true;
  lastX = x;
  velocity = 0;
};

const move = x => {
  if (!dragging) return;
  const dx = x - lastX;
  rotationY += dx * 0.3;
  velocity = dx * 0.3;
  lastX = x;
};

const end = () => {
  dragging = false;
  const target = Math.round(rotationY / SNAP) * SNAP;
  velocity = (target - rotationY) * 0.15;
};

function animate() {
  /* カメラ移動 */
  if (intro) {
    cameraZ += (targetZ - cameraZ) * 0.05;
  }

  /* 回転慣性 */
  if (!dragging) {
    rotationY
