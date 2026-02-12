// chapter2/carousel3d.js
export function initCarousel3D(options = {}) {
  const cylinder = document.querySelector(".main-cylinder");
  const frontPanels = [...document.querySelectorAll(".outer")];
  const backPanels = [...document.querySelectorAll(".inner")];

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
    // 1. スピード計算（モード別）
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

    // 2. 角度の更新
    const totalSpeed = baseSpeed + dragSpeed + extraSpeed;
    dragSpeed *= 0.85;
    visualAngle += totalSpeed;

    // 3. 親シリンダーの回転（これが滑らかさの肝）
cylinder.style.transform = `rotateX(-22deg) rotateY(${visualAngle}deg)`;

    // 4. パネルごとの不透明度とインデックス管理
    frontPanels.forEach((p, i) => {
      const rad = (i * 36 + visualAngle) * Math.PI / 180;
      const z = Math.cos(rad);
      p.style.opacity = z > 0 ? Math.min(z * 20, 1) : 0;
      p.style.visibility = z > 0 ? "visible" : "hidden";
      
      // 正面に一番近いものを判定
      if (z > 0.98 && i !== prevIndex) {
        options.onIndexChange?.(i);
        prevIndex = i;
      }
    });

    backPanels.forEach((p, i) => {
      // インデックス5枚分(180度)ずらす
      const rad = ((i + 5) * 36 + visualAngle) * Math.PI / 180;
      const z = Math.cos(rad);
      p.style.opacity = z < 0 ? Math.min(-z * 20, 1) : 0;
      p.style.visibility = z < 0 ? "visible" : "hidden";
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
      
      // 最初の計算が終わってから表示クラスを追加
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
