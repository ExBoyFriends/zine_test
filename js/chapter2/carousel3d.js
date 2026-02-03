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

  /* ===== 時間設計 ===== */
  const TOTAL_TIME = 20000;
  const FREE_TIME  = 13000;
  const FINAL_TIME = 2000;

  /* ===== 速度設計 ===== */
  const BASE_SPEED = 0.45;
  const HOLD_MAX   = 8;
  const AUTO_MAX   = 10;
  const EXIT_MAX   = 14;

  let angle = 0;
  let speed = BASE_SPEED;

  let mode = "free"; // free | auto | exit
  let hold = false;

  let startTime = performance.now();
  let rafId = null;

  /* ===== 初期配置 ===== */
  outers.forEach((p, i) => {
    p.style.transform =
      `translate(-50%, -50%) rotateY(${i * SNAP}deg) translateZ(${R_FRONT}px)`;
  });

  inners.forEach((p, i) => {
    p.style.transform =
      `translate(-50%, -50%) rotateY(${i * SNAP + 180}deg) translateZ(${R_BACK}px) rotateY(180deg)`;
  });

  function updateDots() {
    const normalized = ((angle % 360) + 360) % 360;
    const index = Math.round(normalized / SNAP) % COUNT;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    options.onIndexChange?.(index);
  }

  function animate(now) {
    const elapsed = now - startTime;

    /* ===== フェーズ遷移 ===== */
    if (mode === "free" && elapsed >= FREE_TIME) {
      mode = "auto";
    }

    if (mode === "auto" && elapsed >= TOTAL_TIME) {
      mode = "exit";
      options.onExit?.();
    }

    /* ===== スピード制御 ===== */
    if (mode === "free") {
      if (hold) {
        speed += (HOLD_MAX - speed) * 0.15;
      } else {
        speed += (BASE_SPEED - speed) * 0.08;
      }
    }

    if (mode === "auto") {
      const remain = TOTAL_TIME - elapsed;

      if (remain <= FINAL_TIME) {
        const t = 1 - remain / FINAL_TIME;
        const target = AUTO_MAX + t * (EXIT_MAX - AUTO_MAX);
        speed += (target - speed) * 0.12;
      } else {
        speed += (AUTO_MAX - speed) * 0.05;
      }
    }

    if (mode === "exit") {
      speed += (EXIT_MAX - speed) * 0.15;
    }

    angle += speed;
    updateDots();

    const rot =
      `translate(-50%, -50%) rotateX(-22deg) rotateY(${angle}deg)`;

    front.style.transform = rot;
    back.style.transform  = rot;

    rafId = requestAnimationFrame(animate);
  }

  function start() {
    startTime = performance.now();
    rafId = requestAnimationFrame(animate);
  }

  function stop() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* ===== 戻った時の急減速 ===== */
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    stop();
    angle = 0;
    speed = EXIT_MAX;
    mode = "free";
    hold = false;
    start();
  });

  start();

  return {
    isFreePhase() {
      return mode === "free";
    },
    startHold() {
      if (mode !== "free") return;
      hold = true;
    },
    endHold() {
      hold = false;
    }
  };
}
