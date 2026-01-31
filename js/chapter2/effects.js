// effects.js
// 見た目のグリッチ状態だけを管理する（入力・時間管理は一切しない）

let active = false;

// グリッチ効果開始
export function startGlitch() {
  if (active) return;
  active = true;
  document.body.classList.add("glitch-active");
}

// グリッチ効果停止
export function stopGlitch() {
  if (!active) return;
  active = false;
  document.body.classList.remove("glitch-active");
}

// 初期化（将来拡張用・今は安全確認のみ）
export function initGlitchLayer() {
  // glitch-overlay が存在するかだけ確認
  const glitch = document.querySelector(".glitch-overlay");
  if (!glitch) {
    console.warn("[glitch] .glitch-overlay not found");
  }
}
