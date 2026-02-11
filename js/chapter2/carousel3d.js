// chapter2/carousel3d.js
// chapter2/carousel3d.js
export function initCarousel3D(options = {}) {
  const front = document.querySelector(".cylinder-front");
  const back  = document.querySelector(".cylinder-back");
  const outers = [...document.querySelectorAll(".cylinder-front .outer")];
  const inners = [...document.querySelectorAll(".cylinder-back .inner")];

  const COUNT = outers.length;
  if (!COUNT) return;

  const SNAP = 360 / COUNT;
  const R_FRONT = 185;
  const R_BACK  = 170;

  const BASE_SPEED = 0.22;
  const HOLD_SPEED = 8;
  const AUTO_MAX   = 12;
  const EXIT_MAX   = 16;
  const IDLE_MAX   = 1.6;
  const IDLE_TIME  = 25000;
  const AUTO_TOTAL = 35000;
  const AUTO_FINAL = 6000;

  let visualAngle = 0;
  let baseSpeed   = BASE_SPEED;
  let dragSpeed   = 0;
  let extraSpeed  = 0;
  let mode = "normal";

  let rafId = null;
  let idleStartTime = performance.now();
  let autoStartTime = 0;
  let prevIndex = -1;

  // 初期角度を設定
  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  // 正面インデックス判定（手前のみ）
  function getFrontIndex() {
    let maxZ = -2;
    let closestIndex = 0;
    outers.forEach((p, i) => {
      const base = parseFloat(p.dataset.base);
      const rad = (base + visualAngle) * Math.PI / 180;
      const z = Math.cos(rad);
      if (z > maxZ) {
        maxZ = z;
        closestIndex = i;
      }
    });
    return closestIndex;
  }

  function animate(now) {
    // --- モード別速度 ---
    if (mode === "normal") {
      const t = Math.min((now - idleStartTime) / IDLE_TIME, 1);
      const target = BASE_SPEED + t * (IDLE_MAX - BASE_SPEED);
      baseSpeed += (target - baseSpeed) * 0.05;
    } else if (mode === "hold") {
      baseSpeed += (HOLD_SPEED - baseSpeed) * 0.12;
    } else if (mode === "auto") {
      const elapsed = now - autoStartTime;
      const remain  = AUTO_TOTAL - elapsed;
      if (remain <= AUTO_FINAL) {
        const t = 1 - remain / AUTO_FINAL;
        baseSpeed += ((AUTO_MAX + t * (EXIT_MAX - AUTO_MAX)) - baseSpeed) * 0.09;
      } else {
        const t = Math.pow(elapsed / (AUTO_TOTAL - AUTO_FINAL), 3);
        baseSpeed += (Math.max(baseSpeed, AUTO_MAX * t) - baseSpeed) * 0.05;
      }
      if (elapsed >= AUTO_TOTAL) {
        mode = "exit";
        options.onExit?.();
      }
    } else if (mode === "exit") {
      baseSpeed += (EXIT_MAX - baseSpeed) * 0.15;
    }

    // ドラッグノイズ
    const chaos = Math.min(Math.max((baseSpeed - 4) / 6, 0), 1);
    const dragNoise = Math.sin(now * (0.018 + chaos * 0.04)) * Math.sin(now * 0.11) * chaos;
    const speed = baseSpeed * (1 + chaos * 0.18 * Math.sin(now * 0.012)) +
                  (dragSpeed * (1 - chaos * 0.6) + dragSpeed * dragNoise * 0.6) +
                  extraSpeed;

    dragSpeed *= 0.85;
    visualAngle += speed;

    // 正面インデックス更新
    const currentIndex = getFrontIndex();
    if (currentIndex !== prevIndex) {
      options.onIndexChange?.(currentIndex);
      prevIndex = currentIndex;
    }

    // 回転適用
    const cylTransform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    front.style.transform = cylTransform;
    back.style.transform  = cylTransform;

    // --- 手前パネル配置（半円だけ） ---
    outers.forEach((p) => {
      const base = parseFloat(p.dataset.base);
      const angle = (base + visualAngle) % 360;
      if (angle <= 90 || angle >= 270) {
        // 表に見える範囲だけ
        p.style.display = "";
      } else {
        p.style.display = "none";
      }
      p.style.transform = `translate(-50%, -50%) rotateY(${base}deg) translateZ(${R_FRONT}px)`;
    });

    // --- 奥パネル配置（半円だけ、裏向き補正） ---
    inners.forEach((p) => {
      const base = parseFloat(p.dataset.base);
      const angle = (base + visualAngle + 180) % 360;
      if (angle >= 90 && angle <= 270) {
        // 裏側に見える範囲だけ
        p.style.display = "";
      } else {
        p.style.display = "none";
      }
      p.style.transform = `translate(-50%, -50%) rotateY(${base + 180}deg) translateZ(${R_BACK}px) rotateY(180deg)`;
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

  start();

  return {
    startHold() { if (mode !== "auto" && mode !== "exit") mode = "hold"; },
    endHold()   { if (mode === "hold") { mode = "normal"; idleStartTime = performance.now(); } },
    startAuto() { mode = "auto"; autoStartTime = performance.now(); },
    startDrag() { dragSpeed = 0; },
    moveDrag(dx){ dragSpeed += dx * 0.05; },
    endDrag() {},
    setExtraSpeed(v){ extraSpeed = v; },
    stop,
  };
}
