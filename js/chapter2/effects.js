// chapter2/effects.js

// 見た目のグリッチ状態だけを管理する（入力・時間管理は一切しない）

let active = false;

/* =====================
   内部リセット
===================== */
function resetGlitchState() {
  active = false;
  document.body.classList.remove("glitch-active");
}

/* =====================
   グリッチ効果開始
===================== */
export function startGlitch() {
  if (active) return;
  active = true;
  document.body.classList.add("glitch-active");
}

/* =====================
   グリッチ効果停止
===================== */
export function stopGlitch() {
  if (!active) return;
  resetGlitchState();
}

/* =====================
   初期化
===================== */
export function initGlitchLayer() {
  // glitch-overlay の存在確認
  const glitch = document.querySelector(".glitch-overlay");
  if (!glitch) {
    console.warn("[glitch] .glitch-overlay not found");
  }

  // 初回ロード時は必ずクリーンに
  resetGlitchState();

  // bfcache 復帰対応
  window.addEventListener("pageshow", e => {
    if (e.persisted) {
      resetGlitchState();
    }
  });
}
