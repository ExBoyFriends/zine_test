// chapter2/carousel3d.js
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

  const BASE_AUTO_SPEED = 0.25;
  const ACCEL_FOLLOW    = 0.06;

  let angle = 0;
  let visualAngle = 0;

  let dragging = false;
  let isHolding = false;
  let transitionStarted = false;

  let extraSpeed = 0;
  let targetExtraSpeed = 5;  // 初期スピード（通常回転スピード）

  let rafId = null;
  let currentIndex = 0;

  let startTime = 0;
  let pressStartTime = 0;
  let holdTime = 0;
  let speedingUp = false;

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
    targetExtraSpeed = 5;  // 通常回転に戻す

    currentIndex = 0;
    options.onIndexChange?.(0);

    front.style.transform = "";
    back.style.transform  = "";

    outers.forEach(p => (p.style.transform = ""));
    inners.forEach(p => (p.style.transform = ""));
  }

  /* =====================
     アニメーション
  ===================== */
  function animate() {
    if (!Number.isFinite(extraSpeed)) extraSpeed = 0;

    // target に滑らかに追従
    extraSpeed += (targetExtraSpeed - extraSpeed) * ACCEL_FOLLOW;

    // 常に時間で回す
    visualAngle += BASE_AUTO_SPEED + extraSpeed;

    // holding / dragging していない時だけ同期
    if (!isHolding && !dragging) {
      angle = visualAngle;
    }

    /* ===== 正面 index 判定（dots 用） ===== */
    const normalized = ((visualAngle % 360) + 360) % 360;
    const index = Math.round(normalized / SNAP) % COUNT;

    if (index !== currentIndex) {
      currentIndex = index;
      options.onIndexChange?.(currentIndex);
    }

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
    pressStartTime = performance.now();

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
    window.__carousel__?.setExtraSpeed(5);

    // 減速処理
    setTimeout(() => {
      if (!isHolding && !speedingUp) {
        targetExtraSpeed = 5; // 通常回転速度に戻す
      }
    }, 500); // ゆっくり減速
  }

  /* =====================
     8秒後の自動加速（オートスピード）
  ===================== */
  function startAutoTransition(callback) {
    startTime = performance.now();

    function tick() {
      const elapsed = performance.now() - startTime;

      if (elapsed >= 8000 && elapsed <= 13000) {
        // 8秒後から自動加速
        const speed = Math.min(10, 5 + (elapsed - 8000) / 500);
        targetExtraSpeed = speed;
      }

      if (elapsed >= 13000) {
        // 13秒後に自動遷移
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
      targetExtraSpeed = Math.min(Math.max(v, 0), 10);
    },
    setHolding(v) {
      isHolding = v;

      if (!v && !transitionStarted) {
        targetExtraSpeed = 5;
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


