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
  let targetExtraSpeed = 0;

  let rafId = null;

  let currentIndex = 0;

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
  }

  /* =====================
     アニメーション
  ===================== */
  function animate() {
    if (!Number.isFinite(extraSpeed)) extraSpeed = 0;

    // target に滑らかに追従
    extraSpeed += (targetExtraSpeed - extraSpeed) * ACCEL_FOLLOW;

    // 遷移前の上限
    if (!transitionStarted && !isHolding && extraSpeed > 8) {
      extraSpeed = 8;
    }

    // 常に時間で回す
    visualAngle += BASE_AUTO_SPEED + extraSpeed;

    // holding / dragging していない時だけ同期
    if (!isHolding && !dragging) {
      angle = visualAngle;
    }

    /* ===== 正面 index 判定（dots 用） ===== */
    const normalized =
      ((visualAngle % 360) + 360) % 360;

    const index =
      Math.round(normalized / SNAP) % COUNT;

    if (index !== currentIndex) {
      currentIndex = index;
      options.onIndexChange?.(currentIndex);
    }

    /* ===== transform ===== */
    const cylTransform =
      `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

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

      // 長押し解除時だけ減速を許可
      if (!v && !transitionStarted) {
        targetExtraSpeed = 0;
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

    // ====================
    // 追加: 減速処理（長押し解除後）
    // ====================
    smoothDeceleration() {
      // 現在の extraSpeed を取得
      const currentSpeed = targetExtraSpeed;

      // 高速回転中の場合、そのスピードを超えないように減速
      const maxSpeed = Math.max(currentSpeed, BASE_AUTO_SPEED);

      // 減速処理
      let startTime = performance.now();
      function decelerate() {
        const elapsed = performance.now() - startTime;
        const transitionDuration = 500; // 500ms以内にスムーズに戻す

        if (elapsed < transitionDuration) {
          const speed = Math.max(
            maxSpeed - (maxSpeed - BASE_AUTO_SPEED) * (elapsed / transitionDuration),
            BASE_AUTO_SPEED
          );
          targetExtraSpeed = speed;
          requestAnimationFrame(decelerate);
        } else {
          // 完了したら最終的に BASE_AUTO_SPEED に設定
          targetExtraSpeed = BASE_AUTO_SPEED;
        }
      }

      decelerate();
    }
  };
}

