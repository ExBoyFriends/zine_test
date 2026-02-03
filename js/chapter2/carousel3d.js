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

  let angle = 0;
  let visualAngle = 0;

  let dragging = false;
  let isHolding = false;
  let transitionStarted = false;

  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  let rafId = null;
  let currentIndex = 0;

  let speedingUp = false;

  // ドット要素の取得
  const dotsWrap = document.querySelector(".dots");
  const dots = [...document.querySelectorAll(".dot")];

  // 各パネルの基準角
  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  /* =====================
     状態リセット
  ===================== */
  function resetState() {
    angle = 0;
    visualAngle = 0;

    dragging = false;
    isHolding = false;
    transitionStarted = false;

    extraSpeed = 0;
    targetExtraSpeed = 0;

    currentIndex = 0;
    options.onIndexChange?.(0);

    front.style.transform = "";
    back.style.transform  = "";

    outers.forEach(p => (p.style.transform = ""));
    inners.forEach(p => (p.style.transform = ""));

    // ドットのリセット
    updateDots(0);
  }

  /* =====================
     ドットの更新
  ===================== */
  function updateDots() {
    const normalized = (visualAngle % 360 + 360) % 360;
    const dotIndex = Math.round(normalized / SNAP) % COUNT;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === dotIndex);
    });
  }

  /* =====================
     イージング関数：時間の経過に応じて加速を変化させる
  ===================== */
  function easeInOut(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  /* =====================
     アニメーション
  ===================== */
  function animate() {
    if (!Number.isFinite(extraSpeed)) extraSpeed = 0;

    // target に滑らかに追従
    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.06; // 減速の度合い

    // 常に時間で回す
    visualAngle += 0.25 + extraSpeed;

    // ドットの更新
    updateDots();

    /* ===== transform ===== */
    const cylTransform = `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

    front.style.transform = cylTransform;
    back.style.transform  = cylTransform;

    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%)
         rotateY(${base + angle}deg)
         translateZ(${R_FRONT}px)`;
    });

    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%)
         rotateY(${base + angle + 180}deg)
         translateZ(${R_BACK}px)
         rotateY(180deg)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  /* =====================
     起動 / 停止
  ===================== */
  function start() {
    if (rafId != null) return;
    rafId = requestAnimationFrame(animate);
  }

  function stop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  start();

  /* =====================
     長押しの処理
  ===================== */
  function startPress() {
    if (isHolding) return;

    isHolding = true;

    // 長押しによる加速開始
    window.__carousel__?.setHolding(true);
    window.__carousel__?.setExtraSpeed(6); // 最大8まで加速

    // タイマー（加速）
    speedingUp = true;
    setTimeout(() => {
      if (!isHolding) return;
      targetExtraSpeed = Math.min(targetExtraSpeed + 1, 8); // 最大スピードは8
    }, 500);
  }

  function endPress() {
    if (!isHolding) return;

    isHolding = false;
    speedingUp = false;

    // 長押し解除時、通常回転に戻す
    window.__carousel__?.setHolding(false);
    window.__carousel__?.setExtraSpeed(0.25);

    // 減速処理
    setTimeout(() => {
      if (!isHolding && !speedingUp) {
        targetExtraSpeed = 0.25; // 通常回転速度に戻す
      }
    }, 500); // ゆっくり減速
  }

  /* =====================
     20秒後の自動遷移、最後の2秒で最大速度に
  ===================== */
  function startAutoTransition(callback) {
    const startTime = performance.now();

    function tick() {
      const elapsed = performance.now() - startTime;
      const totalDuration = 20000; // 20秒
      const accelDuration = 12000;  // 12秒

      let speed = 0;

      if (elapsed < accelDuration) {
        // 加速（イージング関数を使用して滑らかに）
        speed = easeInOut(elapsed, 0, 7, accelDuration); // 最初の12秒で加速
      } else if (elapsed >= accelDuration && elapsed <= totalDuration - 2000) {
        // 徐々に一定スピードに到達
        speed = 7; // 加速後、スピード維持
      } else {
        // 最後の2秒で最大スピードに
        const remaining = totalDuration - elapsed;
        speed = 7 + (remaining / 2000) * 8; // 最後の2秒で最大15になる
      }

      targetExtraSpeed = Math.min(speed, 15);

      // 20秒後に自動遷移
      if (elapsed >= totalDuration) {
        callback();
        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* =====================
     bfcache 対応
  ===================== */
  window.addEventListener("pageshow", e => {
    if (e.persisted) {
      stop();
      resetState();
      start();
    }
  });

  /* =====================
     外部 API
  ===================== */
  return {
    setExtraSpeed(v) {
      targetExtraSpeed = Math.min(Math.max(v, 0), 15);
    },
    setHolding(v) {
      isHolding = v;

      if (!v && !transitionStarted) {
        targetExtraSpeed = 0.25;
      }
    },
    startTransition() {
      transitionStarted = true;
    },
    startDrag() {
      dragging = true;
    },
    moveDrag(dx) {
      angle += dx * 0.35;
      visualAngle = angle;
    },
    endDrag() {
      dragging = false;
    },
    startAutoTransition
  };
}

