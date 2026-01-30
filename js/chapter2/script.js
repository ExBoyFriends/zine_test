const cylinder = document.getElementById("cylinder");

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
    `translateZ(0) rotateX(-22deg) rotateY(${rotationY}deg)`;

  requestAnimationFrame(animate);
}


animate();

window.addEventListener("mousedown", e => start(e.clientX));
window.addEventListener("mousemove", e => move(e.clientX));
window.addEventListener("mouseup", end);

window.addEventListener("touchstart", e => start(e.touches[0].clientX), { passive: true });
window.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
window.addEventListener("touchend", end);
