// chapter2/carousel3d.js
export function initCarousel3D(options = {}) {
  const cylinderFront = document.querySelector(".cylinder-front");
  const cylinderBack  = document.querySelector(".cylinder-back");
  const frontPanels   = [...document.querySelectorAll(".cylinder-front .outer")];
  const backPanels    = [...document.querySelectorAll(".cylinder-back .inner")];

  const COUNT = frontPanels.length;
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

  // front/back パネルに初期角度を設定
  frontPanels.forEach((p, i) => p.dataset.base = i * SNAP);
  backPanels.forEach((p, i) => p.dataset.base = i * SNAP);

  // 正面(front)パネルの判定
  function getFrontIndex() {
    let maxZ = -2;
    let closestIndex = 0;
    frontPanels.forEach((p, i) => {
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
    const chaos = Math.min(Math.max((baseSpeed - 4) / 6, 0), 1);

    // --- モード別速度 ---
    if (mode === "normal") {
      const t = Math.min((now - idleStartTime)/IDLE_TIME, 1);
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
        baseSpeed += (Math.max(baseSpeed, AUTO_MAX*t) - baseSpeed) * 0.05;
      }
      if (elapsed >= AUTO_TOTAL) {
        mode = "exit";
        options.onExit?.();
      }
    } else if (mode === "exit") {
      baseSpeed += (EXIT_MAX - baseSpeed) * 0.15;
    }

    const dragNoise = Math.sin(now*(0.018+chaos*0.04)) * Math.sin(now*0.11) * chaos;
    const speed = baseSpeed * (1 + chaos*0.18*Math.sin(now*0.012)) +
                  (dragSpeed*(1-chaos*0.6) + dragSpeed*dragNoise*0.6) +
                  extraSpeed;

    dragSpeed *= 0.85;
    visualAngle += speed;

    // --- 正面インデックス更新 ---
    const currentIndex = getFrontIndex();
    if (currentIndex !== prevIndex) {
      options.onIndexChange?.(currentIndex);
      prevIndex = currentIndex;
    }

    // --- Cylinder 回転 ---
    const cylTransform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    if (cylinderFront) cylinderFront.style.transform = cylTransform;
    if (cylinderBack)  cylinderBack.style.transform  = cylTransform;

    // --- frontパネル配置（半円だけ表示） ---
    frontPanels.forEach((p) => {
      const base = parseFloat(p.dataset.base);
      const rad  = (base + visualAngle) * Math.PI / 180;
      const z    = Math.cos(rad);
      p.style.transform = `rotateY(${base}deg) translateZ(${R_FRONT}px)`;
      // 数値を小さく（1.5など）すると、消える範囲が狭まり、より長く表示されます
      const opacity = Math.min(Math.max(z * 1.5 + 0.5, 0), 1);
      p.style.opacity = opacity;
    });

    // --- backパネル配置（半円だけ表示） ---
    backPanels.forEach((p) => {
      const base = parseFloat(p.dataset.base);
      const rad  = (base + visualAngle) * Math.PI / 180;
      const z    = Math.cos(rad);
     // rotateY(180deg) で画像を表に向ける
      p.style.transform = `rotateY(${base}deg) translateZ(${R_BACK}px) rotateY(180deg)`;

      // 奥側の不透明度計算：-z が高いほど奥にある。ここも 1.5 で緩やかに
      const opacity = Math.min(Math.max(-z * 1.5 + 0.5, 0), 1);
      p.style.opacity = opacity;
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
    startHold() { if (mode!=="auto"&&mode!=="exit") mode="hold"; },
    endHold()   { if (mode==="hold") { mode="normal"; idleStartTime=performance.now(); } },
    startAuto() { mode="auto"; autoStartTime=performance.now(); },
    startDrag() { dragSpeed=0; },
    moveDrag(dx){ dragSpeed+=dx*0.05; },
    endDrag()   {},
    setExtraSpeed(v){ extraSpeed=v; },
    stop,
    reset(speed=BASE_SPEED){ visualAngle=0; baseSpeed=speed; }
  };
}
