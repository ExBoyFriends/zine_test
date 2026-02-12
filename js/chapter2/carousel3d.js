/**
 * Chapter 2: 3D Cylinder Carousel
 * 5枚のカードを表裏ペアで管理し、72度ピッチで回転させる
 */
export function initCarousel3D(options = {}) {
  const cylinder = document.querySelector(".main-cylinder");
  const frontPanels = [...document.querySelectorAll(".outer")];
  const backPanels = [...document.querySelectorAll(".inner")];

  if (!cylinder) return null;

  // --- 設定定数 ---
  const COUNT = 5;          // カード枚数
  const STEP = 360 / COUNT; // 72度刻み
  const BASE_SPEED = 0.22;  // 通常時の回転速度
  const HOLD_SPEED = 8;     // 長押し時の加速速度
  const AUTO_MAX   = 12;    // 自動遷移時の最大速度
  const EXIT_MAX   = 16;    // 終了時の爆走速度
  const IDLE_MAX   = 1.6;   // 放置時の最高速度
  const IDLE_TIME  = 25000; // 加速完了までの時間
  const AUTO_TOTAL = 35000; // 自動遷移の総時間
  const AUTO_FINAL = 6000;  // 最終加速フェーズの時間

  // --- 内部状態 ---
  let visualAngle = 0;      // 現在の回転角度
  let baseSpeed   = BASE_SPEED;
  let dragSpeed   = 0;
  let extraSpeed  = 0;
  let mode        = "normal"; // normal | hold | auto | exit
  let rafId       = null;
  let prevIndex   = -1;
  let idleStartTime = 0;
  let autoStartTime = 0;

  /**
   * 毎フレームの計算と描画
   */
  function updateRender(now) {
    // 1. スピード計算（モードに応じた加速処理）
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
    dragSpeed *= 0.85; // ドラッグ慣性の減衰
    visualAngle += totalSpeed;

    // 3. 親シリンダーの回転適用（中央固定を維持）
    cylinder.style.transform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

  // 4. 表(outer)の処理
    frontPanels.forEach((p, i) => {
      const angle = i * STEP;
      const rad = (angle + visualAngle) * Math.PI / 180;
      const z = Math.cos(rad);

      // z > 0.2 くらいで早めにフェードを開始させ、サイドの「消えゆく感じ」を強調
      if (z > 0.1) {
        // 指数関数的に透明度を変えると、より「きゅっと」した質感になります
        p.style.opacity = Math.pow(z, 1.2); 
        p.style.visibility = "visible";
      } else {
        p.style.opacity = 0;
        p.style.visibility = "hidden";
      }
      
      // ドットのインデックス更新判定（正面に来た瞬間）
      if (z > 0.98 && i !== prevIndex) {
        options.onIndexChange?.(i);
        prevIndex = i;
      }
    });

   // 5. 裏(inner)の処理
    backPanels.forEach((p, i) => {
      const angle = i * STEP;
      const rad = (angle + visualAngle) * Math.PI / 180;
      const z = Math.cos(rad);

      // 奥側の裏面は、より「影」の中に沈んでいるように
      if (z < -0.1) {
        p.style.opacity = Math.min(Math.abs(z) * 0.6, 0.4);
        p.style.visibility = "visible";
      } else {
        p.style.opacity = 0;
        p.style.visibility = "hidden";
      }
    });
  }

  function animate(now) {
    updateRender(now);
    rafId = requestAnimationFrame(animate);
  }

  // 公開 API
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
    startDrag() {
      dragSpeed = 0;
    },
    moveDrag(dx) {
      dragSpeed += dx * 0.05;
    },
    setExtraSpeed(v) {
      extraSpeed = v;
    },
    reset(speed = BASE_SPEED) {
      visualAngle = 0;
      baseSpeed = speed;
    }
  };
}
