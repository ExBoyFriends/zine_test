// chapter2/carousel3d.js
export function initCarousel3D(options = {}) {
  const front  = document.querySelector(".cylinder-front");
  const back   = document.querySelector(".cylinder-back");
  const outers = document.querySelectorAll(".outer");
  const inners = document.querySelectorAll(".inner");
  const dots   = [...document.querySelectorAll(".dot")];

  const COUNT = outers.length;
  if (!COUNT) return;

  const SNAP = 360 / COUNT;
  const R_FRONT = 185;
  const R_BACK  = 170;

  /* =====================
     回転状態
  ===================== */
  let angle = 0;          // パネル論理角
  let visualAngle = 0;   // 見た目角（常にこれで回す）

  let baseSpeed = 0.25;  // 通常回転
  let extraSpeed = 0;
  let targetExtraSpeed = 0;

  let rafId = null;
  let transitionPhase = "normal"; 
  // normal | auto | exit | return

  /* =====================
     初期配置
  ===================== */
  outers.forEach((p, i) => (p.dataset.base = i * SNAP));
  inners.forEach((p, i) => (p.dataset.base = i * SNAP));

  /* =====================
     ドット（正面検知）
  ===================== */
  function updateDots() {
    let closest = 0;
    let min = Infinity;

    outers.forEach((p, i) => {
      const base = +p.dataset.base;
      const a = (base + angle) % 360;
      const diff = Math.abs(((a + 180) % 360) - 180);
      if (diff < min) {
        min = diff;
        closest = i;
      }
    });

    dots.forEach((d, i) => d.classList.toggle("active", i === closest));
  }

  /* =====================
     メインループ
  ===================== */
  function animate() {
    extraSpeed += (targetExtraSpeed - extraSpeed) * 0.06;

    visualAngle += baseSpeed + extraSpeed;
    angle = visualAngle;

    updateDots();

    const cyl =
      `translate(-50%, -50%) rotateX(-22deg) rotateY(${visualAngle}deg)`;

    front.style.transform = cyl;
    back.style.transform  = cyl;

    outers.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%) rotateY(${base + angle}deg) translateZ(${R_FRONT}px)`;
    });

    inners.forEach(p => {
      const base = +p.dataset.base;
      p.style.transform =
        `translate(-50%, -50%) rotateY(${base + angle + 180}deg)
         translateZ(${R_BACK}px) rotateY(180deg)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  function start() {
    if (rafId) return;
    rafId = requestAnimationFrame(animate);
  }

  function stop() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  start();

  /* =====================
     自動遷移（20秒）
  ===================== */
  function startAutoTransition(onExit) {
    const startTime = performance.now();
    transitionPhase = "auto";

    function tick(now) {
      const t = now - startTime;

      if (t < 18000) {
        // 0〜18秒：超なだらか
        targetExtraSpeed = (t / 18000) ** 2 * 3;
      } else {
        // 最後2秒：一気に最大
        const k = Math.min((t - 18000) / 2000, 1);
        targetExtraSpeed = 3 + k * 12;
      }

      if (t >= 20000) {
        transitionPhase = "exit";
        onExit?.();
        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* =====================
     BFCache 復帰演出
  ===================== */
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    stop();

    // 高速 → 急減速 → 通常へ
    extraSpeed = 14;
    targetExtraSpeed = 0;
    transitionPhase = "return";

    start();

    setTimeout(() => {
      baseSpeed = 0.25;
      transitionPhase = "normal";
    }, 1200);
  });

  /* =====================
     外部API
  ===================== */
  const api = {
    setExtraSpeed(v) {
      targetExtraSpeed = Math.max(0, v);
    },
    startAutoTransition
  };

  window.__carousel__ = api;
  return api;
}
