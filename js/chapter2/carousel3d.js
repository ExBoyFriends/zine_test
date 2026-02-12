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
     // zが0より大きい（手前半分）の時だけ表示。
      // 0になった瞬間に一瞬で消えるように調整
      const opacity = z > 0 ? Math.min(z * 20, 1) : 0; 
      p.style.opacity = opacity;
      
      // 完全に奥にいったら非表示(display)にするのも手ですが、
      // まずは opacity: 0 で十分なはずです
      p.style.visibility = z > 0 ? "visible" : "hidden";
    });
    
  // --- backパネル配置（半円だけ表示） ---
    backPanels.forEach((p) => {
      const base = parseFloat(p.dataset.base);
      const rad  = (base + visualAngle) * Math.PI / 180;
      const z    = Math.cos(rad);
      
      // rotateY(180deg) で画像を表に向ける
      p.style.transform = `rotateY(${base}deg) translateZ(${R_BACK}px) rotateY(180deg)`;

      // zが0より小さい（奥半分）の時だけ表示
      const opacity = z < 0 ? Math.min(-z * 20, 1) : 0;
      p.style.opacity = opacity;

      // ★ここを置き換え：
      // 計算結果が z < 0 (奥側) になった瞬間だけ、CSSの強制非表示を上書きして表示させる
      if (z < 0) {
        p.style.setProperty("visibility", "visible", "important");
      } else {
        p.style.setProperty("visibility", "hidden", "important");
      }
    });

    rafId = requestAnimationFrame(animate);
  }

 function start() {
    // 1. まず現在の時間を取得
    const startTime = performance.now();
    idleStartTime = startTime;
    
    // 2. 【重要】描画ループに入る「前」に、その場で全計算を完了させる
    // これで 1コマ目から正しい位置・透明度になります
    animate(startTime); 
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
