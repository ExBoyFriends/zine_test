// chapter2/carousel3d.js
export function initCarousel3D(options = {}) {
  const cylinder = document.querySelector(".main-cylinder");
  const frontPanels = [...document.querySelectorAll(".outer")];
  const backPanels = [...document.querySelectorAll(".inner")];

  if (!cylinder) return;

  let visualAngle = 0;
  let baseSpeed = 0.22;
  let dragSpeed = 0;
  let extraSpeed = 0;
  let mode = "normal";
  let rafId = null;
  let prevIndex = -1;

  // 定数
  const HOLD_SPEED = 8;
  const AUTO_MAX = 12;
  const EXIT_MAX = 16;
  const IDLE_MAX = 1.6;
  const IDLE_TIME = 25000;
  const AUTO_TOTAL = 35000;
  const AUTO_FINAL = 6000;

  function updateRender(now) {
    // スピード計算
    if (mode === "normal") {
      const t = Math.min((now - performance.now())/IDLE_TIME, 1); // 簡易化
      baseSpeed += (IDLE_MAX - baseSpeed) * 0.005; 
    } else if (mode === "hold") {
      baseSpeed += (HOLD_SPEED - baseSpeed) * 0.12;
    }

    const speed = baseSpeed + dragSpeed + extraSpeed;
    dragSpeed *= 0.85;
    visualAngle += speed;

    // 親シリンダーを回転させるだけ (これが滑らかさの秘訣)
    cylinder.style.transform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

    // 各パネルの不透明度・表示切替 (奥行き感の維持)
    frontPanels.forEach((p, i) => {
      const rad = (i * 36 + visualAngle) * Math.PI / 180;
      const z = Math.cos(rad);
      p.style.opacity = z > 0 ? Math.min(z * 20, 1) : 0;
      p.style.visibility = z > 0 ? "visible" : "hidden";
      if (z > 0.9 && i !== prevIndex) {
        options.onIndexChange?.(i);
        prevIndex = i;
      }
    });

    backPanels.forEach((p, i) => {
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
      updateRender(performance.now());
      cylinder.classList.add('cylinder-ready');
      rafId = requestAnimationFrame(animate);
    },
    stop() { cancelAnimationFrame(rafId); rafId = null; },
    startHold() { if (mode !== "auto") mode = "hold"; },
    endHold() { mode = "normal"; },
    moveDrag(dx) { dragSpeed += dx * 0.05; }
  };
}

  return {
    start,
    startHold() { if (mode !== "auto" && mode !== "exit") mode = "hold"; },
    endHold()   { if (mode === "hold") { mode = "normal"; idleStartTime = performance.now(); } },
    startAuto() { mode = "auto"; autoStartTime = performance.now(); },
    startDrag() { dragSpeed = 0; },
    moveDrag(dx){ dragSpeed += dx * 0.05; },
    endDrag()   {},
    setExtraSpeed(v){ extraSpeed = v; },
    stop,
    reset(speed = BASE_SPEED){ visualAngle = 0; baseSpeed = speed; }
  };
}
