const cylinder = document.getElementById("cylinder");
const outers = document.querySelectorAll(".panel.outer");


let dragging = false;
let lastX = 0;
let velocity = 0;
let rotationY = 0;

const DAMPING = 0.92;

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

const end = () => dragging = false;

function animate() {
  if (!dragging) {
    rotationY += velocity;
    velocity *= DAMPING;
  }

 cylinder.style.transform =
    `rotateX(-22deg) rotateY(${rotationY}deg)`;

  outers.forEach(panel => {
    const i = Number(panel.style.getPropertyValue("--i"));
    const angle =
      (rotationY + i * 72) * Math.PI / 180;

    // 正面=1 / 横=0.4 / 奥=0.15
    const light =
      Math.max(0.15, Math.cos(angle) * 0.85);

    panel.style.filter = `brightness(${light})`;
  });

  requestAnimationFrame(animate);
}


animate();

window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
window.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
window.addEventListener("touchend", end);
