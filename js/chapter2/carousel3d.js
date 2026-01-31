export function initCarousel3D() {
  const front  = document.querySelector(".cylinder-front");
  const back   = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");

  const COUNT = outers.length;
  const SNAP  = 360 / COUNT;

  const R_FRONT = 185; // 前面の半径
  const R_BACK  = 170; // 背面の半径

  const BASE_AUTO_SPEED = 0.25;

  let angle = 0;        // 回転の角度（固定）
  let visualAngle = 0;  // 見た目の角度（加速）

  let dragging = false;
  let isHolding = false;

  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  outers.forEach((p, i) => p.dataset.base = i * SNAP);
  inners.forEach((p, i) => p.dataset.base = i * SNAP);

  function animate() {
    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.07;

    if (!dragging) {
      // 見た目の角度だけ進める
      visualAngle += BASE_AUTO_SPEED + extraSpeed;

      // 長押し中でなければ、判定角度も進める
      if (!isHolding) {
        angle = visualAngle;
      }
    }

    // front と back の回転
    front.style.transform = `rotateX(-22deg) rotateY(${visualAngle}deg)`;
    back.style.transform  = `rotateX(-22deg) rotateY(${visualAngle}deg)`;

    // outer パネルの回転
    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform = `rotateY(${base + angle}deg) translateZ(${R_FRONT}px)`;
    });

    // inner パネルの回転
    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform = `
        rotateY(${base + angle + 180}deg) 
        translateZ(${R_BACK}px)
        rotateY(180deg)
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
      isHolding = v; // 長押し判定
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


