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
  
  // 初期インデックスを保持
  let prevIndex = -1; 

  // 各パネルに初期角度をデータ属性として保持
  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  /**
   * 最も正面（Z軸手前）に近いパネルのインデックスを返す
   */
  function getFrontIndex() {
    let maxZ = -2;
    let closestIndex = 0;

    outers.forEach((p, i) => {
      const base = parseFloat(p.dataset.base);
      // パネルの現在の合計角度をラジアンに変換
      const currentRad = ((base + visualAngle) * Math.PI) / 180;
      // Z値（奥行き）を計算。Math.cos(0) = 1 なので、1に近いほど正面。
      const z = Math.cos(currentRad);

      if (z > maxZ) {
        maxZ = z;
        closestIndex = i;
      }
    });
    return closestIndex;
  }

  function animate(now) {
    const chaos = Math.min(Math.max((baseSpeed - 4) / 6, 0), 1);

    // --- モード別速度計算 ---
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

    // --- ドラッグ & ノイズ処理 ---
    const dragNoise = Math.sin(now * (0.018 + chaos * 0.04)) * Math.sin(now * 0.11) * chaos;
    const speed = baseSpeed * (1 + chaos * 0.18 * Math.sin(now * 0.012)) +
                  (dragSpeed * (1 - chaos * 0.6) + dragSpeed * dragNoise * 0.6) +
                  extraSpeed;

    dragSpeed *= 0.85;
    visualAngle += speed;

    // --- ★ 正面判定とドット更新 ---
    const currentIndex = getFrontIndex();
    if (currentIndex !== prevIndex) {
      options.onIndexChange?.(currentIndex);
      prevIndex = currentIndex;
    }

    // --- Transform 適応 ---
    const cylTransform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    front.style.transform = cylTransform;
    back.style.transform  = cylTransform;

    outers.forEach((p) => {
      const base = parseFloat(p.dataset.base);
      p.style.transform = `translate(-50%, -50%) rotateY(${base}deg) translateZ(${R_FRONT}px)`;
    });

    inners.forEach((p) => {
      const base = parseFloat(p.dataset.base);
      // 背面パネルは内側を向くように調整
      p.style.transform = `translate(-50%, -50%) rotateY(${base + 180}deg) translateZ(${R_BACK}px) rotateY(180deg)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  // --- 制御系 ---
  function start() {
    idleStartTime = performance.now();
    rafId = requestAnimationFrame(animate);
  }

  function stop() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;
    stop();
    visualAngle = 0;
    baseSpeed = EXIT_MAX;
    mode = "normal";
    prevIndex = -1;
    start();
  });

  start();

  return {
    startHold() { if (mode !== "auto" && mode !== "exit") mode = "hold"; },
    endHold()   { if (mode === "hold") { mode = "normal"; idleStartTime = performance.now(); } },
    startAuto() { mode = "auto"; autoStartTime = performance.now(); },
    startDrag() { dragSpeed = 0; },
    moveDrag(dx){ dragSpeed += dx * 0.05; },
    endDrag() {},
    setExtraSpeed(v){ extraSpeed = v; }
  };
}
