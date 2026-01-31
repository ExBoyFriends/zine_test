// carousel3d.js
export function initCarousel3D() {
  const front = document.querySelector(".cylinder-front");
  const back  = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");

  const COUNT = outers.length;
  const SNAP  = 360 / COUNT;

  const R_FRONT = 185;
  const R_BACK  = 170;

  const AUTO_SPEED = -0.2;
  const DAMPING = 0.85;

  let dragging = false;
  let velocity = 0;
  let angle = 0;

  /* ★★★ ここが抜けてた ★★★ */
  outers.forEach((p, i) => p.dataset.base = i * SNAP);
  inners.forEach((p, i) => p.dataset.base = i * SNAP);

  function animate() {
    if (!dragging) {
      angle += velocity;
      velocity *= DAMPING;
      if (Math.abs(velocity) < 0.01) velocity = 0;
      if (velocity === 0) angle += AUTO_SPEED;
    }

    front.style.transform = `rotateX(-22deg) rotateY(${angle}deg)`;
    back.style.transform  = `rotateX(-22deg) rotateY(${angle}deg)`;

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
    startDrag() {
      dragging = true;
      velocity = 0;
    },
    moveDrag(dx) {
      angle += dx * 0.35;
      velocity = dx * 0.15;
    },
    endDrag() {
      dragging = false;
      const target = Math.round(angle / SNAP) * SNAP;
      velocity = (target - angle) * 0.1;
    }
  };
}
