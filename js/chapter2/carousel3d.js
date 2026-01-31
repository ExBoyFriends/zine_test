// carousel3d.js
export function initCarousel3D() {
  const front  = document.querySelector(".cylinder-front");
  const back   = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");

  const COUNT = outers.length;
  const SNAP  = 360 / COUNT;

  const R_FRONT = 185;
  const R_BACK  = 170;

  const BASE_AUTO_SPEED = 0.25;

  let angle = 0;
  let visualAngle = 0;

  let dragging = false;
  let isHolding = false;

  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  outers.forEach((p, i) => p.dataset.base = i * SNAP);
  inners.forEach((p, i) => p.dataset.base = i * SNAP);

  function animate() {
    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.07;

    if (!dragging) {
      visualAngle += BASE_AUTO_SPEED + extraSpeed;
      if (!isHolding) angle = visualAngle;
    }

    // 円筒自体は回すだけ（位置は固定）
   front.style.transform =
  `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
back.style.transform =
  `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;


    // 🔒 各カードは「回転＋奥行き」だけ
    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%)
         rotateY(${base + angle}deg)
         translateZ(${R_FRONT}px)`;
    });

    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%)
         rotateY(${base + angle + 180}deg)
         translateZ(${R_BACK}px)
         rotateY(180deg)`;
    });

    requestAnimationFrame(animate);
  }

  animate();

  return {
    setExtraSpeed(v) {
      targetExtraSpeed = Math.min(Math.max(0, v), 9);
    },
    setHolding(v) {
      isHolding = v;
    },
    startDrag() {
      dragging = true;
    },
    moveDrag(dx) {
      angle += dx * 0.35;
      visualAngle = angle;
    },
    endDrag() {
      dragging = false;
    }
  };
}
