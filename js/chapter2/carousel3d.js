// chapter2/carousel3d.js

export function initCarousel3D(options = {}) {
  const front  = document.querySelector(".cylinder-front");
  const back   = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");
  const dots   = document.querySelectorAll(".dot");

  const COUNT = outers.length;
  if (!COUNT) return;

  const SNAP = 360 / COUNT;
  const R_FRONT = 185;
  const R_BACK  = 170;

  const BASE_SPEED = 0.08;      // 通常回転
  const HOLD_MAX   = 8;         // 長押し最大
  const EXIT_MAX   = 16;        // 最終最大

  const TOTAL_TIME = 20000;     // 自動遷移 20s
  const FINAL_TIME = 2000;      // 最後の2秒

  let angle = 0;
  let visualAngle = 0;

  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  let isHolding = false;
  let isCommitted = false;
  let exited = false;

  let rafId = null;
  let startTime = performance.now();

  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  function updateDots() {
    const normalized = ((visualAngle % 360) + 360) % 360;
    const index = Math.round(normalized / SNAP) % COUNT;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    options.onIndexChange?.(index);
  }

  function animate(now) {
    const elapsed = now - startTime;

    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.05;

    let autoSpeed = BASE_SPEED;

    if (!isCommitted) {
      if (elapsed > TOTAL_TIME - FINAL_TIME) {
        const t = (elapsed - (TOTAL_TIME - FINAL_TIME)) / FINAL_TIME;
        autoSpeed += t * EXIT_MAX;
        isCommitted = true;
      }
    }

    if (!isHolding && !isCommitted) {
      targetExtraSpeed = 0;
    }

    visualAngle += autoSpeed + extraSpeed;

    updateDots();

    const cyl =
      `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

    front.style.transform = cyl;
    back.style.transform  = cyl;

    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%)
         rotateY(${base + visualAngle}deg)
         translateZ(${R_FRONT}px)`;
    });

    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%)
         rotateY(${base + visualAngle + 180}deg)
         translateZ(${R_BACK}px)
         rotateY(180deg)`;
    });

    if (!exited && elapsed >= TOTAL_TIME) {
      exited = true;
      options.onExit?.();
      return;
    }

    rafId = requestAnimationFrame(animate);
  }

  function start() {
    if (rafId) return;
    startTime = performance.now();
    rafId = requestAnimationFrame(animate);
  }

  function stop() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  function startHold() {
    if (isCommitted) return;
    isHolding = true;
    targetExtraSpeed = HOLD_MAX;
  }

  function endHold() {
    if (isCommitted) return;
    isHolding = false;
    targetExtraSpeed = 0;
  }

  window.addEventListener("pageshow", e => {
    if (e.persisted) {
      stop();
      angle = visualAngle = 0;
      extraSpeed = targetExtraSpeed = 0;
      isHolding = false;
      isCommitted = false;
      exited = false;
      start();
    }
  });

  start();

  return {
    startHold,
    endHold,
    forceCommit() {
      isCommitted = true;
      targetExtraSpeed = EXIT_MAX;
    }
  };
}
