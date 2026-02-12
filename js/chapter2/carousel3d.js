// chapter2/carousel3d.js
export function initCarousel3D(options = {}) {
  const cylinder = document.querySelector(".main-cylinder");
  const allPanels = [...document.querySelectorAll(".outer, .inner")];

  if (!cylinder) return null;

  // 定数
  const BASE_SPEED = 0.22;
  const HOLD_SPEED = 8;
  const AUTO_MAX   = 12;
  const EXIT_MAX   = 16;
  const IDLE_MAX   = 1.6;
  const IDLE_TIME  = 25000;
  const AUTO_TOTAL = 35000;
  const AUTO_FINAL = 6000;

  // 状態変数
  let visualAngle = 0;
  let baseSpeed   = BASE_SPEED;
  let dragSpeed   = 0;
  let extraSpeed  = 0;
  let mode        = "normal";
  let rafId       = null;
  let prevIndex   = -1;
  let idleStartTime = 0;
  let autoStartTime = 0;

  function updateRender(now) {
    // 1. スピード計算
    if (mode === "normal") {
      const t = Math.min((now - idleStartTime) / IDLE_TIME, 1);
      const target = BASE_SPEED + t * (IDLE_MAX - BASE_SPEED);
      baseSpeed += (target - baseSpeed) * 0.05;
    } else if (mode === "hold") {
      baseSpeed += (HOLD_SPEED - baseSpeed) * 0.12;
    } else if (mode === "auto") {
      const elapsed = now - autoStartTime;
      const remain = AUTO_TOTAL - elapsed;
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

    // 2. 回転更新
    const totalSpeed = baseSpeed + dragSpeed + extraSpeed;
    dragSpeed *= 0.85;
    visualAngle += totalSpeed;

    // 3. 中央固定の回転
    cylinder.style.transform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

    // 4. 統合された透明度・インデックス管理
    allPanels.forEach((p, i) => {
      const baseAngle = i * 36;
      const rad = (baseAngle + visualAngle) * Math.PI / 180;
      const z = Math.cos(rad); // 正面度(1が正面)

      // カメラの方向（z > -0.1）を向いている間だけ表示
      if (z > -0.1) {
        p.style.opacity = Math.min((z + 0.1) * 8, 1);
        p.style.visibility = "visible";
      } else {
        p.style.opacity = 0;
        p.style.visibility = "hidden";
      }

      // 表面カード(0-4)が正面に来たときにドットを更新
      if (i < 5 && z > 0.98 && i !== prevIndex) {
        options.onIndexChange?.(i);
        prevIndex = i;
      }
    });
  }

  function animate(now) {
    updateRender(now);
    rafId = requestAnimationFrame(animate);
  }

  return {
    start() {
      if (rafId) return;
      idleStartTime = performance.now();
      updateRender(idleStartTime);
      requestAnimationFrame(() => {
        cylinder.classList.add('cylinder-ready');
        rafId = requestAnimationFrame(animate);
      });
    },
    stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    },
    startHold() { if (mode !== "auto" && mode !== "exit") mode = "hold"; },
    endHold()   { if (mode === "hold") { mode = "normal"; idleStartTime = performance.now(); } },
    startAuto() { mode = "auto"; autoStartTime = performance.now(); },
    startDrag() { dragSpeed = 0; },
    moveDrag(dx){ dragSpeed += dx * 0.05; },
    setExtraSpeed(v){ extraSpeed = v; },
    reset(speed = BASE_SPEED){ visualAngle = 0; baseSpeed = speed; }
  };
}
