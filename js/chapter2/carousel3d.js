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

  /* ★ 高速化：DOMアクセスを排除し、数値をメモリ上に保持 */
  const baseAngles = Array.from({ length: COUNT }, (_, i) => i * SNAP);

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
  
  let prevIndex = -1; 

  /**
   * 正面判定：最も手前に来たパネルを Cos で特定
   */
  function getFrontIndex() {
    let maxZ = -2;
    let closestIndex = 0;
    for (let i = 0; i < COUNT; i++) {
      // 角度をラジアンに変換して手前方向の距離(z)を計算
      const currentRad = ((baseAngles[i] + visualAngle) * Math.PI) / 180;
      const z = Math.cos(currentRad);
      if (z > maxZ) {
        maxZ = z;
        closestIndex = i;
      }
    }
    return closestIndex;
  }

  /* ★ 初期配置：手前と奥の「半円構造」を厳密に構築 */
  outers.forEach((p, i) => {
    // 手前の半円（画像パネル）
    p.style.transform = `translate(-50%, -50%) rotateY(${baseAngles[i]}deg) translateZ(${R_FRONT}px)`;
  });

  inners.forEach((p, i) => {
    // 奥の半円（壁パネル）：
    // baseAngles[i] + 180 で円の真裏に配置し、rotateY(180deg) で内側を向かせる
    p.style.transform = `translate(-50%, -50%) rotateY(${baseAngles[i] + 180}deg) translateZ(${R_BACK}px) rotateY(180deg)`;
  });

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

    // --- 正面判定とドット更新 ---
    const currentIndex = getFrontIndex();
    if (currentIndex !== prevIndex) {
      options.onIndexChange?.(currentIndex);
      prevIndex = currentIndex;
    }

    // --- シリンダー全体の回転（これが以前の見え方の肝） ---
    const cylTransform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    front.style.transform = cylTransform;
    back.style.transform  = cylTransform;

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
