// chapter2/holdTransition.js

import { startGlitch, stopGlitch } from "./effects.js";

let pressing = false, exited = false, timer = null, holding = false;
const AUTO_DELAY = 15000, HOLD_DELAY = 200; // 長押し 200ms

export function resetTransitionState() { pressing = holding = exited = false; clearTimeout(timer); timer = null; }

export function startAutoTransition(onExit) { clearTimeout(timer); timer = setTimeout(() => { if (exited) return; window.__carousel__?.startAuto(); }, AUTO_DELAY); }

export function markExited() { exited = true; }

export function bindLongPressEvents(el) {
  if (!el) return;
  el.addEventListener("pointerdown", () => {
    if (exited) return;
    pressing = true;
    holding = false;
    timer = setTimeout(() => {
      if (!pressing || exited) return;
      holding = true;
      window.__carousel__?.startHold();
      startGlitch();
    }, HOLD_DELAY);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(t => el.addEventListener(t, endPress));
}

function endPress() {
  if (!pressing) return;
  pressing = false;
  clearTimeout(timer);
  if (holding) { stopGlitch(); window.__carousel__?.endHold(); }
  holding = false;
}

window.addEventListener("pageshow", e => { if (e.persisted) resetTransitionState(); });
