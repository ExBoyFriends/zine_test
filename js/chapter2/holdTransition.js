// chapter2/holdTransition.js

import { startGlitch, stopGlitch } from "./effects.js";

let pressing = false;
let exited = false;
let timer = null;
let holding = false;

const AUTO_DELAY = 8500;// 8.5秒後に自動加速開始
const HOLD_DELAY = 600;

export function resetTransitionState() {
  pressing = false;
  holding = false;
  exited = false; // ここを確実にリセット
  clearTimeout(timer);
  timer = null;
}

export function startAutoTransition(onExit) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (exited) return;
    window.__carousel__?.startAuto();
  }, AUTO_DELAY);
}

export function markExited() {
  exited = true;
}

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
      setTimeout(() => {
        if (holding && pressing) startGlitch();
      }, 400);
    }, HOLD_DELAY);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(t =>
    el.addEventListener(t, endPress)
  );
}

function endPress() {
  if (!pressing) return;
  pressing = false;
  clearTimeout(timer);
  if (holding) {
    stopGlitch();
    window.__carousel__?.endHold();
  }
  holding = false;
}

window.addEventListener("pageshow", e => {
  if (e.persisted) resetTransitionState();
});
