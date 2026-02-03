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

  /* ===== 回転定数 ===== */
  const BASE_SPEED = 0.22;
  const HOLD_SPEED = 8;
  const AUTO_MAX   = 12;
  const EXIT_MAX   = 16;

  const TOTAL_TIME = 20000;
  const FINAL_TIME = 2000;

  let visualAngle = 0;
  let speed = BASE_SPEED;

  let mode = "normal"; // normal | hold | auto | exit
  let rafId = null;
  let startTime = 0;

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

    /* ===== モード別スピード ===== */
    if (mode === "normal") {
      speed += (BASE_SPEED - speed) * 0.08;
    }

    if (mode === "hold") {
      speed += (HOLD_SPEED - speed) * 0.1;
    }

    if (mode === "auto") {
      const remain = TOTAL_TIME - elapsed;

      if (remain <= FINAL_TIME) {
        const t = 1 - remain / FINAL_TIME;
        speed += ((AUTO_MAX + t * (EXIT_MAX - AUTO_MAX)) - speed) * 0.08;
      } else {
        const t = elapsed / (TOTAL_TIME - FINAL_TIME);
        speed += (AUTO_MAX * t - speed) * 0.06;
      }
    }

    if (mode === "exit") {
      speed += (EXIT_MAX - speed) * 0.15;
    }

    visualAngle += speed;
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

    if (elapsed >= TOTAL_TIME && mode === "auto") {
      mode = "exit";
      options.onExit?.();
    }

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

  /* ===== bfcache ===== */
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    stop();
    visualAngle = 0;
    speed = EXIT_MAX;
    mode = "normal";
    start();
  });

  start();

  return {
    startHold() {
      if (mode === "auto" || mode === "exit") return;
      mode = "hold";
    },
    endHold() {
      if (mode === "hold") mode = "normal";
    },
    startAuto() {
      mode = "auto";
      startTime = performance.now();
    }
  };
}
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

  /* ===== スピード定義 ===== */
  const BASE_SPEED = 0.18;      // 通常回転（少し速く）
  const HOLD_MAX   = 8;         // 長押し最大
  const AUTO_MAX   = 12;        // 自動加速最大
  const EXIT_MAX   = 16;        // 最終

  const TOTAL_TIME = 20000;
  const FINAL_TIME = 2000;

  let visualAngle = 0;
  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  let isHolding = false;
  let autoPhase = false;
  let committed = false;

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

    /* ===== 自動遷移フェーズ ===== */
    if (autoPhase && !committed) {
      const remain = TOTAL_TIME - elapsed;

      if (remain <= FINAL_TIME) {
        const t = 1 - remain / FINAL_TIME;
        targetExtraSpeed = AUTO_MAX + t * (EXIT_MAX - AUTO_MAX);
        committed = true;
      } else {
        const t = elapsed / (TOTAL_TIME - FINAL_TIME);
        targetExtraSpeed = t * AUTO_MAX;
      }
    }

    /* ===== 追従（グラデーション） ===== */
    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.05;

    visualAngle += BASE_SPEED + extraSpeed;

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

    if (elapsed >= TOTAL_TIME) {
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

  /* ===== bfcache 戻り演出 ===== */
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    stop();
    visualAngle = 0;
    extraSpeed = EXIT_MAX;
    targetExtraSpeed = 0;
    isHolding = false;
    autoPhase = false;
    committed = false;

    startTime = performance.now();
    start();
  });

  start();

  return {
    startHold() {
      if (committed) return;
      isHolding = true;
      targetExtraSpeed = HOLD_MAX;
    },
    endHold() {
      if (committed) return;
      isHolding = false;
      targetExtraSpeed = 0;
    },
    startAutoPhase() {
      autoPhase = true;
    }
  };
}
