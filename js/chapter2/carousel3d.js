export function initCarousel3D() {
  const front = document.querySelector(".cylinder-front");
  const back = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");

  const COUNT = outers.length;
  const SNAP = 360 / COUNT;

  const R_FRONT = 185;
  const R_BACK = 170;

  const BASE_AUTO_SPEED = 0.25;

  let angle = 0;
  let visualAngle = 0;

  let dragging = false;
  let isHolding = false;

  let extraSpeed = 0;
  let targetExtraSpeed = 0;
  let transitionStarted = false; // 遷移開始フラグ

  outers.forEach((p, i) => p.dataset.base = i * SNAP);
  inners.forEach((p, i) => p.dataset.base = i * SNAP);

  // 長押しのタイマー
  let holdTimer = null;
  const HOLD_THRESHOLD = 500; // 長押し時間閾値 (ms)

  // 長押し開始時
  function startHold() {
    isHolding = true;
    targetExtraSpeed = 2; // 長押し開始時に速さを増加させる
    holdTimer = setTimeout(() => {
      // 長押し中、加速の上限まで達する
      if (!transitionStarted) {
        targetExtraSpeed = Math.min(targetExtraSpeed + 0.1, 8); // 遷移前は8に制限
      }
    }, HOLD_THRESHOLD); // 長押し時間が閾値を越えると加速開始
  }

  // 長押し解除時
  function endHold() {
    clearTimeout(holdTimer);
    holdTimer = null;
    isHolding = false;
    targetExtraSpeed = 0; // 長押し終了時に速度を戻す
  }

  // 遷移を開始するタイミングで加速を10にする
  function startTransition() {
    transitionStarted = true;
    targetExtraSpeed = 10; // 遷移開始時に加速を最大にする
  }

  function animate() {
    extraSpeed += (targetExtraSpeed - extraSpeed) * accelerationFactor;

    if (extraSpeed > 8) {
      extraSpeed = 8 + (extraSpeed - 8) * 0.1; // 上限を越えないようにする
    }

    if (!dragging) {
      visualAngle += BASE_AUTO_SPEED + extraSpeed;
      if (!isHolding) angle = visualAngle;
    }

    // 円筒自体の回転（位置は固定）
    front.style.transform =
      `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;
    back.style.transform =
      `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

    // 各カードは回転＋奥行きの調整
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

    requestAnimationFrame(animate);
  }

  animate();

  return {
    setExtraSpeed(v) {
      targetExtraSpeed = Math.min(Math.max(0, v), 10); // 最大加速は10
    },
    setHolding(v) {
      if (v) {
        startHold(); // 長押し開始
      } else {
        endHold(); // 長押し終了
      }
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
    // 遷移開始を呼び出す
    startTransition
  };
}

