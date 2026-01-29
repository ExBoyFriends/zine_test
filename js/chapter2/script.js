const track = document.querySelector(".track");
const slides = document.querySelectorAll(".slide");

const slideWidth = slides[0].offsetWidth;
const singleLoop = slideWidth * (slides.length / 2);

let x = -singleLoop;
let v = 0;

let isDown = false;
let lastX = 0;

function wrap() {
  while (x <= -singleLoop * 2) x += singleLoop;
  while (x >= 0) x -= singleLoop;
}

function tick() {
  if (!isDown) {
    v *= 0.94; // 慣性（軽い）
    if (Math.abs(v) < 0.02) v = 0;
  }

  x += v;
  wrap();

  track.style.transform = `translateX(${x}px)`;
  requestAnimationFrame(tick);
}
tick();

/* --- touch --- */
window.addEventListener("touchstart", e => {
  isDown = true;
  lastX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchmove", e => {
  if (!isDown) return;
  const cx = e.touches[0].clientX;
  const dx = cx - lastX;

  x += dx;
  v = dx;

  lastX = cx;
}, { passive: true });

window.addEventListener("touchend", () => {
  isDown = false;
});

/* --- mouse --- */
window.addEventListener("mousedown", e => {
  isDown = true;
  lastX = e.clientX;
});

window.addEventListener("mousemove", e => {
  if (!isDown) return;
  const dx = e.clientX - lastX;

  x += dx;
  v = dx;

  lastX = e.clientX;
});

window.addEventListener("mouseup", () => {
  isDown = false;
});



