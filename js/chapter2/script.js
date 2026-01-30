const panels = [...document.querySelectorAll(".panel.inner")];

let current = 0;
let startX = 0;
let dragging = false;

function update() {
  panels.forEach((panel, i) => {
    const diff = ((i - current + panels.length) % panels.length);

    // -2,-1,0,1,2 に正規化
    const d = diff > panels.length / 2 ? diff - panels.length : diff;

    if (d === 0) {
      // 奥中央（主役）
      panel.style.opacity = 1;
      panel.style.filter = "brightness(1)";
      panel.style.transform =
        "translateZ(-360px) scale(1)";
    } else if (d === -1) {
      panel.style.opacity = 0.5;
      panel.style.filter = "brightness(0.7)";
      panel.style.transform =
        "rotateY(18deg) translateZ(-300px) scale(0.85)";
    } else if (d === 1) {
      panel.style.opacity = 0.5;
      panel.style.filter = "brightness(0.7)";
      panel.style.transform =
        "rotateY(-18deg) translateZ(-300px) scale(0.85)";
    } else {
      // 見せない
      panel.style.opacity = 0;
      panel.style.transform =
        "translateZ(-600px) scale(0.6)";
    }
  });
}

update();

/* ドラッグ操作（1枚ずつ切り替え） */
window.addEventListener("pointerdown", e => {
  dragging = true;
  startX = e.clientX;
});

window.addEventListener("pointerup", e => {
  if (!dragging) return;
  dragging = false;

  const dx = e.clientX - startX;
  if (dx > 40) {
    current = (current - 1 + panels.length) % panels.length;
  } else if (dx < -40) {
    current = (current + 1) % panels.length;
  }
  update();
});
