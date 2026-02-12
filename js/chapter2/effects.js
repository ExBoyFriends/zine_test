// chapter2/effects.js

let active = false;
function resetGlitchState() { active = false; document.body.classList.remove("glitch-active"); }

export function startGlitch() { if (active) return; active = true; document.body.classList.add("glitch-active"); }
export function stopGlitch() { if (!active) return; resetGlitchState(); }

export function initGlitchLayer() {
  const glitch = document.querySelector(".glitch-overlay");
  if (!glitch) console.warn("[glitch] .glitch-overlay not found");
  resetGlitchState();
  window.addEventListener("pageshow", e => { if (e.persisted) resetGlitchState(); });
}
