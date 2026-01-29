const track = document.querySelector(".track");
const slides = document.querySelectorAll(".slide");

const slideWidth = slides[0].offsetWidth;
const loopWidth = slideWidth * (slides.length / 2);

let x = -loopWidth / 2;
let v = 0;

let dragging = false;
let lastX = 0;

function wrap(val) {
  if (val <= -loopWidth) return val + loopWidth;
  if (val >= 0) return val - loopWidth;
  return val;
}

function update() {
  if (!dragging) {
    v *= 0.95;            // ← 慣性の正体（軽い）
    if (Math.abs(v) < 0.01) v = 0;
    x += v;
  }

  x = wrap(x);
  track.style.transform = `translateX(${x}px)`;

  requestAnimationFrame(update);
}
update();

/* touch */
track.addEventListener("touchstart", e => {
  dragging = true;
  lastX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener("touchmove", e => {
  const cx = e.touches[0].clientX;
  const dx = cx - lastX;
  x += dx;
  v = dx;
  lastX = cx;
}, { passive: true });

track.addEventListener("touchend", () => dragging = false);

/* mouse */
track.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
});

window.addEventListener("mousemove", e => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  x += dx;
  v = dx;
  lastX = e.clientX;
});

window.addEventListener("mouseup", () => dragging = false);


