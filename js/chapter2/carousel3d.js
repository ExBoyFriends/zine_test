// chapter2/carousel3d.js

export function initCarousel3D(options = {}) {
  const front  = document.querySelector(".cylinder-front");
  const back   = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");

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

  const IDLE_MAX  = 1.6;
  const IDLE_TIME = 25000;

  const AUTO_TOTAL = 35000; //自動回転の総時間
  const AUTO_FINAL = 6000; //最終加速フェーズの時間

  let visualAngle = 0;
  let baseSpeed  = BASE_SPEED;
  let dragSpeed  = 0;
  let extraSpeed = 0;
  let mode = "normal";

  let rafId = null;
  let idleStartTime = performance.now();
  let autoStartTime = 0;

  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  function animate(now) {
    const chaos = Math.min(Math.max((baseSpeed - 4) / 6, 0), 1);

    // normal / idle
    if (mode === "normal") {
      const t = Math.min((now - idleStartTime) / IDLE_TIME, 1);
      const target = BASE_SPEED + t * (IDLE_MAX - BASE_SPEED);
      baseSpeed += (target - baseSpeed) * 0.05;
    }

    // hold
    if (mode === "hold") {
      baseSpeed += (HOLD_SPEED - baseSpeed) * 0.12;
    }

    // auto
    if (mode === "auto") {
      const elapsed = now - autoStartTime;
      const remain  = AUTO_TOTAL - elapsed;

      if (remain <= AUTO_FINAL) {
        // 最終加速フェーズ
        const t = 1 - remain / AUTO_FINAL;
        baseSpeed += ((AUTO_MAX + t * (EXIT_MAX - AUTO_MAX)) - baseSpeed) * 0.09;
      } else {
        // 通常加速フェーズ
        const t = Math.pow(elapsed / (AUTO_TOTAL - AUTO_FINAL), 3);
        const target = Math.max(baseSpeed, AUTO_MAX * t);
        baseSpeed += (target - baseSpeed) * 0.05;
      }

      if (elapsed >= AUTO_TOTAL) {
        mode = "exit";
        options.onExit?.();
      }
    }

    // exit
    if (mode === "exit") {
      baseSpeed += (EXIT_MAX - baseSpeed) * 0.15;
    }

    // drag & chaos
    const dragNoise =
      Math.sin(now * (0.018 + chaos * 0.04)) *
      Math.sin(now * 0.11) *
      chaos;

    const speed =
      baseSpeed * (1 + chaos * 0.18 * Math.sin(now * 0.012)) +
      (dragSpeed * (1 - chaos * 0.6) + dragSpeed * dragNoise * 0.6) +
      extraSpeed;

    dragSpeed *= 0.85;
    visualAngle += speed;

 /* ===== 正面画像の index を計算（スナップ） ===== */
    let index = Math.round(visualAngle / SNAP) % COUNT;
    if (index < 0) index += COUNT; // 負の角度対応

    // ドット更新
    options.onIndexChange?.(index);

    // cylinder transform
    const cyl = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    front.style.transform = cyl;
    back.style.transform  = cyl;

    // outers / inners
    outers.forEach((p, i) => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%) rotateY(${base + visualAngle}deg) translateZ(${R_FRONT}px)`;
    });

    inners.forEach((p, i) => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%) rotateY(${base + visualAngle + 180}deg) translateZ(${R_BACK}px) rotateY(180deg)`;
    });

    rafId = requestAnimationFrame(animate);
  }



    // cylinder transform
    const cyl = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    front.style.transform = cyl;
    back.style.transform  = cyl;

    // outers / inners
    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%) rotateY(${base + visualAngle}deg) translateZ(${R_FRONT}px)`;
    });

    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%) rotateY(${base + visualAngle + 180}deg) translateZ(${R_BACK}px) rotateY(180deg)`;
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

  // bfcache 対応
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;
    stop();
    visualAngle = 0;
    baseSpeed = EXIT_MAX;
    dragSpeed = 0;
    extraSpeed = 0;
    mode = "normal";
    start();
  });

  start();

  return {
    startHold() {
      if (mode !== "auto" && mode !== "exit") mode = "hold";
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
    startDrag() { dragSpeed = 0; },
    moveDrag(dx) { dragSpeed += dx * 0.05; },
    endDrag() {},
    setExtraSpeed(v) { extraSpeed = v; }
  };
}
