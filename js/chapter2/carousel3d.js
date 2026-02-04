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

  const IDLE_MAX  = 1.4;
  const IDLE_TIME = 12000; // ← 放置時間を後ろ倒し

  const AUTO_TOTAL = 28000; // ← 自動遷移まで長く
  const AUTO_FINAL = 3500;  // ← 直前だけ一気に壊す

  let visualAngle = 0;

  let baseSpeed  = BASE_SPEED;
  let extraSpeed = 0;
  let dragSpeed  = 0;

  let mode = "normal"; // normal | hold | auto | exit

  let rafId = null;
  let idleStartTime = performance.now();
  let autoStartTime = 0;

  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  function updateDots() {
    const normalized = ((visualAngle % 360) + 360) % 360;
    const index = Math.round(normalized / SNAP) % COUNT;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    options.onIndexChange?.(index);
  }

  function animate(now) {
    /* ===== chaos（破綻率）===== */
    const chaos = Math.min(baseSpeed / 6, 1); 
    // 0 → 正常 / 1 → 完全に壊れる

    /* ===== normal / idle ===== */
    if (mode === "normal") {
      const t = Math.min((now - idleStartTime) / IDLE_TIME, 1);
      const target = BASE_SPEED + t * (IDLE_MAX - BASE_SPEED);
      baseSpeed += (target - baseSpeed) * 0.05;
    }

    /* ===== hold ===== */
    if (mode === "hold") {
      baseSpeed += (HOLD_SPEED - baseSpeed) * 0.12;
    }

    /* ===== auto ===== */
    if (mode === "auto") {
      const elapsed = now - autoStartTime;
      const remain  = AUTO_TOTAL - elapsed;

      if (remain <= AUTO_FINAL) {
        const t = 1 - remain / AUTO_FINAL;
        const target = AUTO_MAX + t * (EXIT_MAX - AUTO_MAX);
        baseSpeed += (target - baseSpeed) * 0.09;
      } else {
        const t = elapsed / (AUTO_TOTAL - AUTO_FINAL);
        baseSpeed += (AUTO_MAX * t - baseSpeed) * 0.05;
      }

      if (elapsed >= AUTO_TOTAL) {
        mode = "exit";
        options.onExit?.();
      }
    }

    /* ===== exit ===== */
    if (mode === "exit") {
      baseSpeed += (EXIT_MAX - baseSpeed) * 0.15;
    }

    /* ===== 🧨 意図されたバグ合成 ===== */

    // drag が壊れ始める
    const unstableDrag =
      dragSpeed * (1 - chaos) +
      dragSpeed * Math.sin(now * 0.025) * chaos * 0.4;

    // baseSpeed も裏切る
    const unstableBase =
      baseSpeed * (1 + chaos * 0.18 * Math.sin(now * 0.012));

    const speed =
      unstableBase +
      unstableDrag +
      extraSpeed;

    dragSpeed *= 0.85;

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

    rafId = requestAnimationFrame(animate);
  }

  function start() {
    idleStartTime = performance.now();
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
    baseSpeed = EXIT_MAX; // 一瞬だけ暴走
    dragSpeed = 0;
    extraSpeed = 0;
    mode = "normal";
    idleStartTime = performance.now();
    start();
  });

  start();

  return {
    startHold() {
      if (mode === "auto" || mode === "exit") return;
      mode = "hold";
    },
    endHold() {
      if (mode === "hold") {
        mode = "normal";
        idleStartTime = performance.now();
      }
    },
    startAuto() {
      mode = "auto";
      autoStartTime = performance.now();
    },

    /* ===== drag ===== */
    startDrag() {
      dragSpeed = 0;
    },
    moveDrag(dx) {
      dragSpeed += dx * 0.05;
    },
    endDrag() {},

    /* ===== transitionOut ===== */
    setExtraSpeed(v) {
      extraSpeed = v;
    }
  };
}
