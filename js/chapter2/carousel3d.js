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

  let angle = 0;        // 🔒 判定用（固定される）
  let visualAngle = 0; // 👀 見た目用（加速）

  let dragging = false;
  let isHolding = false;

  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  outers.forEach((p, i) => p.dataset.base = i * SNAP);
  inners.forEach((p, i) => p.dataset.base = i * SNAP);

  function animate() {
    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.07;

    if (!dragging) {
      // 🔥 見た目だけ回す
      visualAngle += BASE_AUTO_SPEED + extraSpeed;

      // 🔒 長押し中でなければ判定角も進める
      if (!isHolding) {
        angle = visualAngle;
      }
    }

    front.style.transform =
      `rotateX(-22deg) rotateY(${visualAngle}deg)`;
    back.style.transform =
      `rotateX(-22deg) rotateY(${visualAngle}deg)`;

    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `rotateY(${base + angle}deg) translateZ(${R_FRONT}px)`;
    });

    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform = `
        translateY(-20px)
        rotateY(${base + angle + 180}deg)
        translateZ(${R_BACK}px)
        rotateY(180deg)
        scale(1)
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();

  return {
    setExtraSpeed(v) {
      targetExtraSpeed = Math.min(Math.max(0, v), 9);
    },
    setHolding(v) {
      isHolding = v; // 🔥 長押し判定ロック
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

