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

  // 🔥 正方向・基準速度
  const BASE_AUTO_SPEED = 0.2;

  let angle = 0;
  let dragging = false;

  // 🔥 なめらか加速用
  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  let isTransitioning = false;

  outers.forEach((p, i) => p.dataset.base = i * SNAP);
  inners.forEach((p, i) => p.dataset.base = i * SNAP);

  function animate() {
    // 🔥 加速をなめらかに追従
    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.08;

    if (!dragging) {
      angle += BASE_AUTO_SPEED + extraSpeed;
    }

    front.style.transform =
      `rotateX(-22deg) rotateY(${angle}deg)`;
    back.style.transform =
      `rotateX(-22deg) rotateY(${angle}deg)`;

    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `rotateY(${base}deg) translateZ(${R_FRONT}px)`;
    });

    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform = `
        translateY(-20px)
        rotateY(${base + 180}deg)
        translateZ(${R_BACK}px)
        rotateY(180deg)
        scale(0.97)
      `;
    });

    requestAnimationFrame(animate);
  }

  animate();

  return {
    setExtraSpeed(v) {
      targetExtraSpeed = v;
    },
    setTransitioning(v) {
      isTransitioning = v;
    },
    startDrag() {
      dragging = true;
    },
    moveDrag(dx) {
      angle += dx * 0.35;
    },
    endDrag() {
      dragging = false;
    }
  };
}
