/**
 * transitionManager.js (完全版)
 */
import { fadeOutAndGo } from "./fade.js";

export function createTransitionManager({
  nextUrl,
  autoDelay = null,
  canAdvance = () => true
}) {
  let timer = null;
  let transitioning = false;

  function startAuto() {
    if (!autoDelay) return;
    timer = setTimeout(() => {
      if (transitioning) return;
      if (!canAdvance()) return;
      goNext();
    }, autoDelay);
  }

  function resetAuto() {
    if (!autoDelay) return;
    if (timer) clearTimeout(timer);
    startAuto();
  }

  function stopAuto() {
    if (timer) clearTimeout(timer);
  }

  function goNext() {
    if (transitioning) return;
    transitioning = true;

    fadeOutAndGo(() => {
      location.href = nextUrl;
    });
  }

  return {
    startAuto,
    resetAuto,
    stopAuto,
    goNext
  };
}
