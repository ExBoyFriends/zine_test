// carousel3d.js
export function initCarousel3D() {
  const front  = document.querySelector(".cylinder-front");
  const back   = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");

  const COUNT = outers.length;
  if (!COUNT) return;

  const SNAP = 360 / COUNT;

  const R_FRONT = 185;
  const R_BACK  = 170;

  const BASE_AUTO_SPEED = 0.25;
  const ACCEL_FOLLOW = 0.06;

  let angle = 0;
  let visualAngle = 0;

  let dragging = false;
  let isHolding = false;
  let transitionStarted = false;

  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  function animate() {
    if (!Number.isFinite(extraSpeed)) extraSpeed = 0;

    // なめらかに target に追従
    extraSpeed += (targetExtraSpeed - extraSpeed) * ACCEL_FOLLOW;

    // 遷移前の上限
    if (!transitionStarted && extraSpeed > 8) {
      extraSpeed = 8;
    }

    // 🔑 常に時間で回す（ドラッグ中でも）
    visualAngle += BASE_AUTO_SPEED + extraSpeed;

    // 🔑 holding / dragging していない時だけ同期
    if (!isHolding && !dragging) {
      angle = visualAngle;
    }

    const cylTransform =
      `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    front.style.transform = cylTransform;
    back.style.transform  = cylTransform;

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
      targetExtraSpeed = Math.min(Math.max(v, 0), 10);
    },
    setHolding(v) {
      isHolding = v;
    },
    startTransition() {
      transitionStarted = true;
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


